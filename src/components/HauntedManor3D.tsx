import { getAssetUrl } from '../utils/assetPath';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { playBatChirp, playDoorCreak, playEctoClick, playEvilLaugh } from '../audio/sfx';
import { audioEngine } from '../audio/audioEngine';
import { spectralNarrator, SpectralNarratorState } from '../audio/spectralNarrator';
import { 
  Compass, 
  Eye, 
  Sparkles, 
  Volume2, 
  Flame, 
  Ghost, 
  Moon, 
  Maximize2,
  RefreshCw,
  Info,
  Mic,
  VolumeX,
  Trophy,
  CheckCircle2,
  Crosshair,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { 
  MANOR_RELICS, 
  calculateManorQuestProgress, 
  ManorRelic 
} from '../game/manorQuestLogic';
import { playGoldenFrenzy } from '../audio/sfx';
import { GothicCobwebCorner, DrippingBloodAccent, HorrorGargoyle } from './GothicDecorations';

type AtmosphereMode = 'lune' | 'sang' | 'ectoplasme';

interface Viewpoint {
  id: string;
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
  desc: string;
}

const VIEWPOINTS: Viewpoint[] = [
  {
    id: 'facade',
    label: 'Façade Gothique',
    pos: [0, 8, 26],
    target: [0, 6, 0],
    desc: 'Vue d\'ensemble sur le manoir centenaire, illuminé par l\'éclat d\'argent de la pleine lune.',
  },
  {
    id: 'cimetiere',
    label: 'Cimetière Brumeux',
    pos: [-11, 3.5, 14],
    target: [-8, 1.5, 6],
    desc: 'Sépultures moussues et croix celtiques oubliées sous la lueur spectrale.',
  },
  {
    id: 'tour',
    label: 'Tour aux Chauves-Souris',
    pos: [8, 18, 12],
    target: [4, 14, -1],
    desc: 'Le clocheton effilé d\'où s\'envolent les créatures de la nuit vers les nuées d\'orage.',
  },
  {
    id: 'citrouilles',
    label: 'Parvis aux Citrouilles',
    pos: [4, 2.5, 15],
    target: [2, 1.2, 10],
    desc: 'Citrouilles sculptées au regard ardent et étincelles folles veillant sur le seuil.',
  },
];

const MANOR_LORE = "Bâti sur d'anciennes fondations maudites, le manoir d'Hylst défie le passage des siècles. Ses vitraux d'ambre et d'émeraude murmurent d'antiques mélodies oubliées tandis que la pleine lune éclaire la tour effilée et ses sentinelles ailées.";

export const HauntedManor3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>('lune');
  const [currentView, setCurrentView] = useState<string>('facade');
  const [isFirstPerson, setIsFirstPerson] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>('Cliquez sur le manoir, les citrouilles ou les chauves-souris pour interagir.');
  const [isSpinningFast, setIsSpinningFast] = useState<boolean>(false);
  const [isNightVision, setIsNightVision] = useState<boolean>(false);
  const [showRelicModal, setShowRelicModal] = useState<boolean>(false);
  const [relicToast, setRelicToast] = useState<{ name: string; points: number; hint: string } | null>(null);
  const [narratorState, setNarratorState] = useState<SpectralNarratorState>(spectralNarrator.getState());

  // Persistent Relics progress
  const [foundRelicIds, setFoundRelicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spookybeats_manor_relics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const questProgress = calculateManorQuestProgress(foundRelicIds);

  const handleRelicFound = (relicId: string) => {
    const relic = MANOR_RELICS.find((r) => r.id === relicId);
    if (!relic) return;

    if (foundRelicIds.includes(relicId)) {
      setActivePrompt(`Relique spectrale déjà purifiée : ${relic.name} (${relic.points} pts)`);
      return;
    }

    playGoldenFrenzy(true);
    const updated = [...foundRelicIds, relicId];
    setFoundRelicIds(updated);
    try {
      localStorage.setItem('spookybeats_manor_relics', JSON.stringify(updated));
    } catch {
      // Ignorer
    }

    setRelicToast({
      name: relic.name,
      points: relic.points,
      hint: relic.lore,
    });
    setTimeout(() => setRelicToast(null), 4500);

    const newProgress = calculateManorQuestProgress(updated);
    if (newProgress.isComplete) {
      setActivePrompt(`🎉 Félicitations Érudit ! Les 7 Reliques sont réunies ! Titre : ${newProgress.title}`);
    } else {
      setActivePrompt(`✨ Relique Découverte : ${relic.name} (+${relic.points} pts) ! ${newProgress.foundCount}/7`);
    }
  };

  const handleRelicFoundRef = useRef(handleRelicFound);
  useEffect(() => {
    handleRelicFoundRef.current = handleRelicFound;
  });

  useEffect(() => {
    const unsub = spectralNarrator.subscribe((state) => {
      setNarratorState(state);
    });
    return unsub;
  }, []);

  // References for animation loop updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    moon: THREE.DirectionalLight;
    rim: THREE.DirectionalLight;
    porchLantern: THREE.PointLight;
    pumpkinLight1: THREE.PointLight;
    pumpkinLight2: THREE.PointLight;
    windowLights: THREE.PointLight[];
    fog: THREE.FogExp2;
    moonMesh: THREE.Mesh;
    haloMesh: THREE.Mesh;
    skyMesh?: THREE.Mesh;
  } | null>(null);

  const batsRef = useRef<Array<{
    group: THREE.Group;
    leftWing: THREE.Mesh;
    rightWing: THREE.Mesh;
    radius: number;
    height: number;
    speed: number;
    angle: number;
    verticalPhase: number;
  }>>([]);

  const pumpkinsRef = useRef<Array<{
    group: THREE.Group;
    baseRotSpeed: number;
  }>>([]);

  const orbsRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL capability safely
    let hasWebGL = true;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      setActivePrompt('WebGL n\'est pas supporté par votre environnement d\'affichage.');
      return;
    }

    const width = container.clientWidth || 400;
    const height = Math.min(window.innerHeight * 0.65, 520);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    camera.position.set(0, 8, 26);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 5;
    controls.maxDistance = 55;
    controls.target.set(0, 6, 0);
    controlsRef.current = controls;

    // 4. Fog & Background: gentle mist (density 0.015) so objects are clearly perceptible
    const fog = new THREE.FogExp2(0x0c0915, 0.015);
    scene.fog = fog;
    scene.background = new THREE.Color(0x0a0712);

    // Panoramique Ciel Nocturne Gothique (Texture générée haute fidélité)
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load(getAssetUrl('assets/manor_haunted_night_skybox.jpg'));
    const skyGeo = new THREE.CylinderGeometry(75, 75, 60, 32, 1, true);
    const skyMat = new THREE.MeshBasicMaterial({ 
      map: skyTexture, 
      side: THREE.BackSide, 
      depthWrite: false,
      fog: false 
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 20, 0);
    scene.add(skyMesh);

    // 5. Lighting: Substantially brighter and balanced with rim and lantern illumination
    // Lumière ambiante violette mystique réhaussée
    const ambientLight = new THREE.AmbientLight(0x352848, 1.45);
    scene.add(ambientLight);

    // Lumière lunaire directionnelle blanche bleutée
    const moonLight = new THREE.DirectionalLight(0x9ec7ff, 2.3);
    moonLight.position.set(22, 36, 18);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.bias = -0.001;
    scene.add(moonLight);

    // Lumière de contour (Rim Light) pour détacher les toitures et clochetons du fond sombre
    const rimLight = new THREE.DirectionalLight(0x8a2be2, 1.6);
    rimLight.position.set(-18, 22, -16);
    scene.add(rimLight);

    // Lanterne du porche d'entrée qui illumine les colonnes et marches
    const porchLantern = new THREE.PointLight(0xffa233, 4.5, 16, 1.2);
    porchLantern.position.set(0, 3.8, 5.2);
    porchLantern.userData = { relicId: 'lanterne_porche' };
    scene.add(porchLantern);

    // Lanterne 3D physique cliquable
    const lanternMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.28, 0.55, 6),
      new THREE.MeshStandardMaterial({ 
        color: 0xd97706, 
        emissive: 0xff7518, 
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
      })
    );
    lanternMesh.position.set(0, 3.8, 5.2);
    lanternMesh.userData = { relicId: 'lanterne_porche' };
    lanternMesh.name = 'porch_lantern';
    scene.add(lanternMesh);

    // Pumpkin internal glow point lights (plus vives et éclatantes)
    const pumpkinLight1 = new THREE.PointLight(0xff7518, 5.0, 14, 1.3);
    pumpkinLight1.position.set(-3.5, 1.6, 9);
    scene.add(pumpkinLight1);

    const pumpkinLight2 = new THREE.PointLight(0xff3914, 4.5, 13, 1.3);
    pumpkinLight2.position.set(3.5, 1.5, 10.5);
    scene.add(pumpkinLight2);

    // Manor window glows
    const winLight1 = new THREE.PointLight(0xffaa22, 3.2, 12, 1.4);
    winLight1.position.set(-2.8, 5.5, 4.5);
    scene.add(winLight1);

    const winLight2 = new THREE.PointLight(0x39ff14, 2.8, 12, 1.4);
    winLight2.position.set(2.8, 5.5, 4.5);
    scene.add(winLight2);

    const winLight3 = new THREE.PointLight(0xc084fc, 3.2, 14, 1.4);
    winLight3.position.set(5.5, 13.5, 2.5);
    scene.add(winLight3);

    // 6. Astre Lunaire 3D resplendissant dans le ciel nocturne
    const moonGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xebf3ff });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(28, 42, -32);
    scene.add(moonMesh);

    // Halo d'argent autour de la lune
    const haloGeo = new THREE.RingGeometry(3.8, 6.2, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x9ec7ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(28, 42, -31.8);
    haloMesh.lookAt(0, 8, 26);
    scene.add(haloMesh);

    // 7. Particules et Feux-Follets Spectraux
    const orbGroup = new THREE.Group();
    const orbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x39ff14, transparent: true, opacity: 0.75 });
    for (let i = 0; i < 28; i++) {
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(
        (Math.random() - 0.5) * 32,
        0.6 + Math.random() * 7,
        (Math.random() - 0.5) * 32
      );
      orb.userData = {
        speedY: 0.2 + Math.random() * 0.4,
        driftPhase: Math.random() * Math.PI * 2,
        initialY: orb.position.y
      };
      orbGroup.add(orb);
    }
    scene.add(orbGroup);
    orbsRef.current = orbGroup;

    lightsRef.current = {
      ambient: ambientLight,
      moon: moonLight,
      rim: rimLight,
      porchLantern,
      pumpkinLight1,
      pumpkinLight2,
      windowLights: [winLight1, winLight2, winLight3],
      fog,
      moonMesh,
      haloMesh,
      skyMesh,
    };

    // 8. Procedural Environment & Manor Construction
    buildProceduralEnvironment(scene);
    buildProceduralManor(scene);
    buildGraveyard(scene);
    buildJackOLanterns(scene, pumpkinsRef);
    buildBats(scene, batsRef);

    // 9. Raycasting for user interaction on 3D elements
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Détection de Relique Fantôme par Raycasting
        let relicId: string | null = null;
        let scanObj: THREE.Object3D | null = intersects[0].object;
        while (scanObj) {
          if (scanObj.userData && scanObj.userData.relicId) {
            relicId = scanObj.userData.relicId;
            break;
          }
          scanObj = scanObj.parent;
        }

        if (relicId) {
          handleRelicFoundRef.current(relicId);
        }

        // Find top-level target name for ambient animations
        let target: THREE.Object3D | null = intersects[0].object;
        while (target && !target.name && target.parent) {
          target = target.parent;
        }

        if (target?.name?.includes('bat')) {
          playBatChirp(true);
          if (!relicId) setActivePrompt('Une chauve-souris siffle dans la pénombre et plonge vers les ténèbres !');
        } else if (target?.name?.includes('pumpkin')) {
          playEctoClick();
          setIsSpinningFast(prev => !prev);
          if (!relicId) setActivePrompt('La citrouille maudite tournoie sous une gerbe d\'étincelles astrales !');
        } else if (target?.name?.includes('door') || target?.name?.includes('manor')) {
          playDoorCreak(true);
          if (!relicId) setActivePrompt('La lourde porte en chêne de la crypte grince sous la rafale...');
        } else if (target?.name?.includes('grave')) {
          playEvilLaugh(true);
          if (!relicId) setActivePrompt('Une voix sépulcrale s\'échappe de la tombe moussue : « Qui ose troubler le repos de Samhain ? »');
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Wing flapping and bat flight trajectories
      batsRef.current.forEach((bat) => {
        bat.angle += bat.speed * delta;
        bat.group.position.x = Math.cos(bat.angle) * bat.radius + Math.sin(bat.angle * 2) * 1.5;
        bat.group.position.z = Math.sin(bat.angle) * bat.radius;
        bat.group.position.y = bat.height + Math.sin(time * 3 + bat.verticalPhase) * 1.2;

        // Orient bat along tangent of circular flight
        bat.group.rotation.y = -bat.angle - Math.PI / 2;
        bat.group.rotation.z = Math.sin(time * 6) * 0.15; // banking

        // Flapping wings
        const flap = Math.sin(time * 16 + bat.verticalPhase) * 0.7;
        bat.leftWing.rotation.z = flap;
        bat.rightWing.rotation.z = -flap;
      });

      // Pumpkins gentle hover and spinning
      pumpkinsRef.current.forEach((p, idx) => {
        const speed = isSpinningFast ? p.baseRotSpeed * 4 : p.baseRotSpeed;
        p.group.rotation.y += speed * delta;
        p.group.position.y = 1.0 + Math.sin(time * 2 + idx) * 0.08;
      });

      // Particules flottantes (feux-follets)
      if (orbsRef.current) {
        orbsRef.current.children.forEach((orbObj) => {
          const orb = orbObj as THREE.Mesh;
          const u = orb.userData;
          orb.position.y += Math.sin(time * 2 + u.driftPhase) * 0.008;
          orb.position.x += Math.cos(time + u.driftPhase) * 0.005;
        });
      }

      // Flicker candlelights & window lights with slight audio reactivity
      const analyser = audioEngine.getAnalyser();
      let audioMod = 1.0;
      if (analyser && audioEngine.getIsPlaying()) {
        const freqData = new Uint8Array(16);
        analyser.getByteFrequencyData(freqData);
        const bassAvg = (freqData[0] + freqData[1] + freqData[2] + freqData[3]) / 4;
        audioMod = 1.0 + (bassAvg / 255) * 0.5;
      }

      if (lightsRef.current) {
        const flicker1 = (0.88 + Math.sin(time * 12) * 0.08 + Math.sin(time * 23) * 0.04) * audioMod;
        const flicker2 = (0.88 + Math.cos(time * 15) * 0.09 + Math.cos(time * 29) * 0.05) * audioMod;
        lightsRef.current.pumpkinLight1.intensity = 5.0 * flicker1;
        lightsRef.current.pumpkinLight2.intensity = 4.5 * flicker2;
        lightsRef.current.porchLantern.intensity = 4.5 * flicker1;
        lightsRef.current.windowLights[0].intensity = 3.2 * flicker1;
        lightsRef.current.windowLights[1].intensity = 2.8 * flicker2;
        lightsRef.current.windowLights[2].intensity = 3.2 * flicker1;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = Math.min(window.innerHeight * 0.65, 520);
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('click', handlePointerDown);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      // Clean scene geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  // Update atmosphere palette (Moon, Blood, Ectoplasm)
  useEffect(() => {
    if (!lightsRef.current || !sceneRef.current) return;
    const { ambient, moon, rim, porchLantern, fog, moonMesh, haloMesh, windowLights, skyMesh } = lightsRef.current;

    if (atmosphere === 'lune') {
      ambient.color.setHex(0x352848);
      ambient.intensity = 1.45;
      moon.color.setHex(0x9ec7ff);
      moon.intensity = 2.3;
      rim.color.setHex(0x8a2be2);
      rim.intensity = 1.6;
      porchLantern.color.setHex(0xffa233);
      fog.color.setHex(0x0c0915);
      sceneRef.current.background = new THREE.Color(0x0a0712);
      (moonMesh.material as THREE.MeshBasicMaterial).color.setHex(0xebf3ff);
      (haloMesh.material as THREE.MeshBasicMaterial).color.setHex(0x9ec7ff);
      if (skyMesh) (skyMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
      windowLights[0].color.setHex(0xffaa22);
      windowLights[1].color.setHex(0x39ff14);
      windowLights[2].color.setHex(0xc084fc);
    } else if (atmosphere === 'sang') {
      ambient.color.setHex(0x4a1420);
      ambient.intensity = 1.5;
      moon.color.setHex(0xff3333);
      moon.intensity = 2.5;
      rim.color.setHex(0x990000);
      rim.intensity = 1.8;
      porchLantern.color.setHex(0xff4422);
      fog.color.setHex(0x1a050a);
      sceneRef.current.background = new THREE.Color(0x160408);
      (moonMesh.material as THREE.MeshBasicMaterial).color.setHex(0xff4444);
      (haloMesh.material as THREE.MeshBasicMaterial).color.setHex(0xcc1111);
      if (skyMesh) (skyMesh.material as THREE.MeshBasicMaterial).color.setHex(0xff7777);
      windowLights[0].color.setHex(0xff2222);
      windowLights[1].color.setHex(0xff5533);
      windowLights[2].color.setHex(0x880000);
    } else if (atmosphere === 'ectoplasme') {
      ambient.color.setHex(0x163820);
      ambient.intensity = 1.4;
      moon.color.setHex(0x44ff55);
      moon.intensity = 2.4;
      rim.color.setHex(0x00cc66);
      rim.intensity = 1.7;
      porchLantern.color.setHex(0x76ff03);
      fog.color.setHex(0x05160b);
      sceneRef.current.background = new THREE.Color(0x04130a);
      (moonMesh.material as THREE.MeshBasicMaterial).color.setHex(0x66ff88);
      (haloMesh.material as THREE.MeshBasicMaterial).color.setHex(0x39ff14);
      if (skyMesh) (skyMesh.material as THREE.MeshBasicMaterial).color.setHex(0x77ff99);
      windowLights[0].color.setHex(0x39ff14);
      windowLights[1].color.setHex(0x00ff88);
      windowLights[2].color.setHex(0x76ff03);
    }
  }, [atmosphere]);

  // First-person walking step
  const walkStep = (dir: 'forward' | 'backward' | 'left' | 'right') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).negate().normalize();

    const stepSize = 1.2;

    if (dir === 'forward') {
      camera.position.addScaledVector(forward, stepSize);
      controls.target.addScaledVector(forward, stepSize);
    } else if (dir === 'backward') {
      camera.position.addScaledVector(forward, -stepSize);
      controls.target.addScaledVector(forward, -stepSize);
    } else if (dir === 'left') {
      camera.position.addScaledVector(right, -stepSize);
      controls.target.addScaledVector(right, -stepSize);
    } else if (dir === 'right') {
      camera.position.addScaledVector(right, stepSize);
      controls.target.addScaledVector(right, stepSize);
    }

    // Keep height at human level
    camera.position.y = 1.8;
    controls.update();
  };

  // Toggle first person mode
  const toggleFirstPersonMode = () => {
    playEctoClick();
    const nextState = !isFirstPerson;
    setIsFirstPerson(nextState);

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (nextState) {
      // Switch to first person: place on ground in front of the manor gates
      camera.position.set(0, 1.8, 16);
      controls.target.set(0, 2.2, 8);
      controls.maxPolarAngle = Math.PI / 2 + 0.05;
      controls.minDistance = 0.5;
      controls.maxDistance = 35;
      controls.update();
      setActivePrompt('Mode Visite Subjective : Déplacez-vous avec les flèches ou les touches Z-Q-S-D.');
    } else {
      // Revert to overview orbit
      handleSelectViewpoint(VIEWPOINTS[0]);
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.minDistance = 3;
      controls.maxDistance = 55;
      controls.update();
      setActivePrompt('Mode Caméra Volante : Orbite libre autour du domaine.');
    }
  };

  // Keyboard controls for walking
  useEffect(() => {
    if (!isFirstPerson) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'z' || k === 'w' || k === 'arrowup') {
        walkStep('forward');
      } else if (k === 's' || k === 'arrowdown') {
        walkStep('backward');
      } else if (k === 'q' || k === 'a' || k === 'arrowleft') {
        walkStep('left');
      } else if (k === 'd' || k === 'arrowright') {
        walkStep('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirstPerson]);

  // Handle viewpoint transitions
  const handleSelectViewpoint = (vp: Viewpoint) => {
    playEctoClick();
    setCurrentView(vp.id);
    setIsFirstPerson(false);
    setActivePrompt(vp.desc);

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    // Smooth target set
    camera.position.set(...vp.pos);
    controls.target.set(...vp.target);
    controls.update();
  };

  // Toggle voice-off narration of the manor lore
  const toggleSpectralNarrator = () => {
    playEctoClick();
    spectralNarrator.toggle(MANOR_LORE, "Le Manoir d'Hylst");
  };

  const isNarrating = narratorState.isSpeaking && narratorState.currentText === MANOR_LORE;

  return (
    <div className="w-full flex flex-col items-center">
      {/* En-tête de section avec décors Dark Gothic */}
      <div className="w-full text-center mb-3 relative">
        <DrippingBloodAccent className="mb-2 opacity-70" />
        <div className="flex items-center justify-center gap-2">
          <HorrorGargoyle size={32} />
          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF7518] via-[#DFB7FF] to-[#39FF14] uppercase">
            Le Manoir Hanté 3D
          </h2>
          <HorrorGargoyle size={32} className="scale-x-[-1]" />
        </div>
        <p className="text-xs text-[#8C8494] mt-1 font-mono">
          Exploration immersive de la bâtisse victorienne illuminée par la lune spectrale
        </p>
      </div>

      {/* Bannière Interactive : La Chasse aux 7 Reliques Fantômes */}
      <div className="w-full mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#1E0D33] via-[#120721] to-[#0D1812] border border-[#39FF14]/50 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#090312] border border-[#39FF14] text-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.4)]">
              <Trophy className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-['Cinzel_Decorative','Syne',serif] font-bold text-white tracking-wider">
                  La Chasse aux 7 Reliques Fantômes
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/60 text-[#39FF14] font-bold">
                  {questProgress.foundCount}/7 Reliques
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono">
                <span className="text-[#FF7518] font-bold">Rang : {questProgress.title}</span>
                <span className="text-[#8C8494]">•</span>
                <span className="text-[#DFB7FF]">{questProgress.scoreBonus} Points</span>
                {questProgress.isComplete && (
                  <span className="text-[#39FF14] font-bold animate-pulse">+500 Bonus Maître</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playEctoClick();
                setIsNightVision(!isNightVision);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isNightVision
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_15px_#39FF14]'
                  : 'bg-[#140D21] text-[#86EFAC] border-[#39FF14]/40 hover:border-[#39FF14]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isNightVision ? 'Vision Normale' : 'Vision Nocturne'}</span>
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setShowRelicModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#201336] text-[#DFB7FF] border border-[#6A0DAD]/60 hover:border-[#FF7518] hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF7518]" />
              <span>Grimoire ({questProgress.foundCount}/7)</span>
            </button>
          </div>
        </div>

        {/* Barre de progression des 7 reliques */}
        <div className="w-full h-1.5 bg-[#0C0614] rounded-full overflow-hidden mt-3 border border-[#6A0DAD]/30">
          <div
            className="h-full bg-gradient-to-r from-[#FF7518] via-[#DFB7FF] to-[#39FF14] transition-all duration-500 shadow-[0_0_8px_#39FF14]"
            style={{ width: `${(questProgress.foundCount / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Conteneur 3D interactif avec cadre orné */}
      <div className={`relative w-full rounded-2xl overflow-hidden border bg-[#07050A] shadow-[0_0_40px_rgba(106,13,173,0.4)] transition-all ${
        isNightVision ? 'border-[#39FF14] shadow-[0_0_40px_rgba(57,255,20,0.4)]' : 'border-[#6A0DAD]/60'
      }`}>
        {/* Toiles d'araignées d'angle */}
        <GothicCobwebCorner position="top-left" size={60} className="absolute top-0 left-0 z-20 opacity-70" />
        <GothicCobwebCorner position="top-right" size={60} className="absolute top-0 right-0 z-20 opacity-70" />

        {/* Effet Filtre Vision Nocturne Spectrale (Phosphorescent green + Scanlines) */}
        {isNightVision && (
          <div className="absolute inset-0 pointer-events-none z-15 bg-[#39FF14]/10 mix-blend-color-dodge backdrop-brightness-125">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.85)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />
            <div className="absolute top-3 left-3 text-[10px] font-mono text-[#39FF14] font-black tracking-widest uppercase bg-black/70 px-2 py-0.5 rounded border border-[#39FF14]/50 animate-pulse">
              ● SPECTRAL NVG 850NM
            </div>
          </div>
        )}

        {/* Toast Relique Découverte */}
        {relicToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-[#09040F]/95 border-2 border-[#39FF14] p-3.5 rounded-2xl shadow-[0_0_25px_#39FF14] max-w-sm sm:max-w-md text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FF7518] animate-spin" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#39FF14]">
                Relique Purifiée ! (+{relicToast.points} pts)
              </span>
            </div>
            <h3 className="font-['Cinzel_Decorative','Syne',serif] font-bold text-sm text-white">
              {relicToast.name}
            </h3>
            <p className="text-[11px] font-serif italic text-[#E2D8CE] mt-1">
              « {relicToast.hint} »
            </p>
          </div>
        )}

        {/* Viewport 3D Three.js */}
        <div 
          ref={mountRef} 
          className="w-full h-[380px] sm:h-[460px] cursor-grab active:cursor-grabbing relative z-10" 
        />

        {/* Barre Supérieure Responsive (ZÉRO chevauchement entre Bulle Narrative & Boutons) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
          {/* Bulle narrative interactive */}
          <div className="pointer-events-auto bg-[#0B0B0B]/90 backdrop-blur-md border border-[#FF7518]/50 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,117,24,0.3)] max-w-sm sm:max-w-md text-center">
            <span className="text-[11px] sm:text-xs text-[#E6E1DC] font-serif italic line-clamp-2">
              {activePrompt}
            </span>
          </div>

          {/* Boutons d'action supérieurs */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Voix off spectrale locale du manoir */}
            <button
              onClick={toggleSpectralNarrator}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg border flex items-center gap-1.5 ${
                isNarrating
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_15px_#39FF14] animate-pulse'
                  : 'bg-[#0B0B0B]/85 text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#39FF14]'
              }`}
              title="Écouter le récit sépulcral du manoir (100% vocal local)"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isNarrating ? 'Voix Active...' : 'Voix du Manoir'}</span>
            </button>

            {/* Bascule Mode 1ère Personne vs Orbite */}
            <button
              onClick={toggleFirstPersonMode}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg border ${
                isFirstPerson
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_15px_#39FF14]'
                  : 'bg-[#0B0B0B]/85 text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#FF7518]'
              }`}
            >
              {isFirstPerson ? '🚶 Visite 1ère Personne' : '🪐 Caméra Volante'}
            </button>
          </div>
        </div>

        {/* D-Pad tactile de marche en mode première personne */}
        {isFirstPerson && (
          <div className="absolute bottom-3 left-3 z-20 bg-[#0B0B0B]/85 backdrop-blur-md p-2 rounded-xl border border-[#39FF14]/50 flex flex-col items-center gap-1">
            <button
              onClick={() => walkStep('forward')}
              className="w-8 h-8 rounded-lg bg-[#241738] text-white hover:bg-[#39FF14] hover:text-black font-bold font-mono text-xs transition-colors"
            >
              ▲
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => walkStep('left')}
                className="w-8 h-8 rounded-lg bg-[#241738] text-white hover:bg-[#39FF14] hover:text-black font-bold font-mono text-xs transition-colors"
              >
                ◀
              </button>
              <button
                onClick={() => walkStep('backward')}
                className="w-8 h-8 rounded-lg bg-[#241738] text-white hover:bg-[#39FF14] hover:text-black font-bold font-mono text-xs transition-colors"
              >
                ▼
              </button>
              <button
                onClick={() => walkStep('right')}
                className="w-8 h-8 rounded-lg bg-[#241738] text-white hover:bg-[#39FF14] hover:text-black font-bold font-mono text-xs transition-colors"
              >
                ▶
              </button>
            </div>
            <span className="text-[9px] font-mono text-[#39FF14]">MARCHER</span>
          </div>
        )}

        {/* Badge Audio-réactif */}
        <div className="absolute bottom-3 right-12 z-20 flex items-center gap-1.5 bg-[#0B0B0B]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#39FF14]/30 text-[10px] font-mono text-[#39FF14]">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          <span>Flammes Synchronisées</span>
        </div>

        {/* Bouton de réinitialisation de caméra */}
        <button
          onClick={() => handleSelectViewpoint(VIEWPOINTS[0])}
          className="absolute bottom-3 right-3 z-20 bg-[#1C1424]/90 hover:bg-[#2C1D38] border border-[#6A0DAD]/60 text-[#DFB7FF] p-2 rounded-xl text-xs transition-colors shadow-lg"
          title="Recentrer la caméra"
          aria-label="Recentrer la caméra"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Pupitre de commande gothique (collapsible bottom dock) */}
      <div className="w-full mt-4 bg-[#120B1A]/90 border border-[#6A0DAD]/50 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        {/* Ligne 1 : Choix des points de vue cinématiques */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold tracking-wider text-[#DFB7FF] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#FF7518]" />
              POINTS DE VUE SPECTRAUX
            </span>
            <span className="text-[10px] text-[#8C8494] font-mono">Orbite libre au toucher / souris</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VIEWPOINTS.map((vp) => (
              <button
                key={vp.id}
                onClick={() => handleSelectViewpoint(vp)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-mono transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                  currentView === vp.id
                    ? 'bg-[#6A0DAD]/40 border-[#39FF14] text-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                    : 'bg-[#1C1424] border-[#6A0DAD]/30 text-[#8C8494] hover:border-[#FF7518]/60 hover:text-[#E6E1DC]'
                }`}
              >
                <span className="font-semibold">{vp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ligne 2 : Atmosphère d'Halloween (Lune, Sang, Ectoplasme) */}
        <div className="pt-3 border-t border-[#6A0DAD]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-[#89b0e8]" />
            <span className="text-xs font-mono text-[#E6E1DC]">Ambiance Lumineuse :</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playEctoClick();
                setAtmosphere('lune');
                setActivePrompt('Pleine lune d\'argent sur la crypte victorienne.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                atmosphere === 'lune'
                  ? 'bg-[#1E2538] border-[#89b0e8] text-[#89b0e8] shadow-[0_0_10px_rgba(137,176,232,0.4)]'
                  : 'bg-[#16121E] border-transparent text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              🌕 Pleine Lune
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setAtmosphere('sang');
                setActivePrompt('Éclipse de Sang : Les esprits réclament vengeance.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                atmosphere === 'sang'
                  ? 'bg-[#380E16] border-[#FF2222] text-[#FF4444] shadow-[0_0_10px_rgba(255,34,34,0.4)]'
                  : 'bg-[#16121E] border-transparent text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              🩸 Lune de Sang
            </button>

            <button
              onClick={() => {
                playEctoClick();
                setAtmosphere('ectoplasme');
                setActivePrompt('Brume spectrale émeraude chargée d\'énergie fantomatique.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                atmosphere === 'ectoplasme'
                  ? 'bg-[#0E2816] border-[#39FF14] text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                  : 'bg-[#16121E] border-transparent text-[#8C8494] hover:text-[#E6E1DC]'
              }`}
            >
              🧪 Ectoplasme
            </button>
          </div>
        </div>

        {/* Instructions tactiles */}
        <div className="mt-3 text-[10px] text-[#8C8494] font-mono text-center flex items-center justify-center gap-3">
          <span>👆 Clic / Touchez les chauves-souris, citrouilles ou tombes</span>
          <span>•</span>
          <span>🔄 Glissez pour pivoter la caméra 3D</span>
        </div>
      </div>

      {/* Grimoire des 7 Reliques Fantômes (Modal) */}
      {showRelicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0F081A] border-2 border-[#6A0DAD] p-5 shadow-[0_0_40px_rgba(106,13,173,0.6)] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#6A0DAD]/40">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-['Cinzel_Decorative','Syne',serif] text-base sm:text-lg font-bold text-white">
                  Grimoire des 7 Reliques Fantômes
                </h3>
              </div>
              <button
                onClick={() => {
                  playEctoClick();
                  setShowRelicModal(false);
                }}
                className="w-7 h-7 rounded-lg bg-[#201336] text-[#8C8494] hover:text-white flex items-center justify-center font-mono text-sm border border-[#6A0DAD]/50"
              >
                ✕
              </button>
            </div>

            <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#39FF14] font-bold">{questProgress.foundCount} / 7 Purifiées</span>
                <span className="text-[#8C8494]">•</span>
                <span className="text-[#FF7518] font-bold">Rang : {questProgress.title}</span>
              </div>
              <span className="text-[#DFB7FF] font-bold">{questProgress.scoreBonus} Points</span>
            </div>

            {/* Liste des 7 Reliques */}
            <div className="space-y-2.5 mt-2">
              {MANOR_RELICS.map((relic) => {
                const isFound = foundRelicIds.includes(relic.id);
                return (
                  <div
                    key={relic.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isFound
                        ? 'bg-[#152419]/60 border-[#39FF14]/60 shadow-[0_0_10px_rgba(57,255,20,0.15)]'
                        : 'bg-[#130B1C]/70 border-[#6A0DAD]/30 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                          isFound ? 'bg-[#39FF14] text-black font-bold' : 'bg-[#221435] text-[#8C8494]'
                        }`}>
                          {isFound ? '✓' : '?'}
                        </span>
                        <div>
                          <h4 className={`text-xs sm:text-sm font-['Cinzel_Decorative','Syne',serif] font-bold ${
                            isFound ? 'text-white' : 'text-[#A69EAF]'
                          }`}>
                            {relic.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#8C8494]">
                            Emplacement : {relic.locationName}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold ${
                        isFound ? 'text-[#39FF14]' : 'text-[#8C8494]'
                      }`}>
                        +{relic.points} pts
                      </span>
                    </div>

                    <p className="text-[11px] font-serif italic text-[#C9BFB5] mt-1.5 pl-8.5">
                      {isFound ? `« ${relic.lore} »` : `Indice : ${relic.clue}`}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions du modal */}
            <div className="mt-5 pt-3 border-t border-[#6A0DAD]/30 flex items-center justify-between">
              <button
                onClick={() => {
                  playEctoClick();
                  setFoundRelicIds([]);
                  try {
                    localStorage.removeItem('spookybeats_manor_relics');
                  } catch {
                    // Ignorer
                  }
                  setActivePrompt('La mémoire des reliques a été effacée. La chasse recommence !');
                }}
                className="text-[10px] font-mono text-[#EF4444] hover:underline cursor-pointer"
              >
                Réinitialiser la chasse aux reliques
              </button>

              <button
                onClick={() => {
                  playEctoClick();
                  setShowRelicModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#39FF14] text-black font-mono text-xs font-bold shadow-[0_0_15px_#39FF14] cursor-pointer"
              >
                Fermer le Grimoire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CONSTRUCTEURS PROCÉDURAUX DE GÉOMÉTRIES 3D (Zéro dépendance externe / Zéro 404)
// ============================================================================

function buildProceduralEnvironment(scene: THREE.Scene) {
  // Sol pavé et terreau de cimetière
  const groundGeo = new THREE.PlaneGeometry(70, 70, 32, 32);
  const pos = groundGeo.attributes.position;
  // Déformation subtile du sol
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const bump = Math.sin(vx * 0.35) * Math.cos(vy * 0.35) * 0.35;
    pos.setZ(i, bump);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x221b2a,
    roughness: 0.85,
    metalness: 0.1,
  });

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Chemin dallé menant au manoir
  const pathGeo = new THREE.PlaneGeometry(3.8, 22, 8, 20);
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0x32283e,
    roughness: 0.75,
    metalness: 0.12,
  });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.05, 11);
  path.receiveShadow = true;
  scene.add(path);
}

function buildProceduralManor(scene: THREE.Scene) {
  const manorGroup = new THREE.Group();
  manorGroup.name = 'haunted_manor';

  // Matériaux revisités pour une meilleure réflectance et visibilité nocturne
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x3d354a,
    roughness: 0.68,
    metalness: 0.2,
  });

  const timberMat = new THREE.MeshStandardMaterial({
    color: 0x24182e,
    roughness: 0.85,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x4e2262,
    roughness: 0.6,
    metalness: 0.25,
  });

  const windowGlowAmber = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
  const windowGlowGreen = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
  const windowGlowPurple = new THREE.MeshBasicMaterial({ color: 0xc084fc });

  // 1. Corps principal du manoir
  const mainBodyGeo = new THREE.BoxGeometry(10, 8, 8);
  const mainBody = new THREE.Mesh(mainBodyGeo, stoneMat);
  mainBody.position.set(0, 4, 0);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  manorGroup.add(mainBody);

  // Corniche en pierre séparant les étages
  const corniceGeo = new THREE.BoxGeometry(10.6, 0.35, 8.6);
  const cornice = new THREE.Mesh(corniceGeo, stoneMat);
  cornice.position.set(0, 4.2, 0);
  cornice.castShadow = true;
  manorGroup.add(cornice);

  // 2. Toiture mansardée en pointe
  const roofGeo = new THREE.ConeGeometry(7.6, 4.8, 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 10.4, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  roof.userData = { relicId: 'gargoyle_roof' };
  manorGroup.add(roof);

  // Sentinelle de pierre (Gargouille perchée)
  const gargoyleGeo = new THREE.BoxGeometry(0.8, 1.0, 0.8);
  const gargoyleMesh = new THREE.Mesh(gargoyleGeo, stoneMat);
  gargoyleMesh.position.set(-3.2, 8.8, 3.8);
  gargoyleMesh.userData = { relicId: 'gargoyle_roof' };
  gargoyleMesh.name = 'roof_gargoyle';
  manorGroup.add(gargoyleMesh);

  // 3. Tour gothique latérale
  const towerGeo = new THREE.CylinderGeometry(2.2, 2.6, 14, 8);
  const tower = new THREE.Mesh(towerGeo, stoneMat);
  tower.position.set(5.5, 7, 1);
  tower.castShadow = true;
  tower.receiveShadow = true;
  tower.userData = { relicId: 'bell' };
  manorGroup.add(tower);

  // Créneaux gothiques en haut de la tour
  const battlementGeo = new THREE.CylinderGeometry(2.6, 2.3, 0.8, 8);
  const battlement = new THREE.Mesh(battlementGeo, stoneMat);
  battlement.position.set(5.5, 14, 1);
  manorGroup.add(battlement);

  // Cloche de minuit visible dans l'ouverture
  const bellGeo = new THREE.CylinderGeometry(0.2, 0.45, 0.7, 8);
  const bellMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
  const bell = new THREE.Mesh(bellGeo, bellMat);
  bell.position.set(5.5, 14.2, 1);
  bell.userData = { relicId: 'bell' };
  bell.name = 'tower_bell';
  manorGroup.add(bell);

  // Flèche effilée de la tour
  const spireGeo = new THREE.ConeGeometry(2.8, 6.5, 8);
  const spire = new THREE.Mesh(spireGeo, roofMat);
  spire.position.set(5.5, 17.5, 1);
  spire.castShadow = true;
  spire.userData = { relicId: 'bell' };
  manorGroup.add(spire);

  // Girouette / Croix de fer au sommet de la tour
  const vanePole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 6), timberMat);
  vanePole.position.set(5.5, 21.2, 1);
  vanePole.userData = { relicId: 'bell' };
  const vaneCross = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), timberMat);
  vaneCross.position.set(5.5, 21.4, 1);
  vaneCross.userData = { relicId: 'bell' };
  manorGroup.add(vanePole, vaneCross);

  // 4. Porche d'entrée avec colonnes et fronton
  const porchRoofGeo = new THREE.ConeGeometry(2.8, 1.8, 4);
  const porchRoof = new THREE.Mesh(porchRoofGeo, roofMat);
  porchRoof.position.set(0, 4.5, 4.8);
  porchRoof.rotation.y = Math.PI / 4;
  porchRoof.castShadow = true;
  manorGroup.add(porchRoof);

  // Colonnes du porche
  const colGeo = new THREE.CylinderGeometry(0.25, 0.3, 3.5, 8);
  const col1 = new THREE.Mesh(colGeo, stoneMat);
  col1.position.set(-1.6, 1.75, 4.8);
  const col2 = new THREE.Mesh(colGeo, stoneMat);
  col2.position.set(1.6, 1.75, 4.8);
  col1.castShadow = true;
  col2.castShadow = true;
  manorGroup.add(col1, col2);

  // Marches en pierre du porche
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 1.2), stoneMat);
  step1.position.set(0, 0.12, 4.6);
  step1.receiveShadow = true;
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 1.2), stoneMat);
  step2.position.set(0, 0.05, 5.4);
  step2.receiveShadow = true;
  manorGroup.add(step1, step2);

  // Porte d'entrée en chêne sombre
  const doorGeo = new THREE.BoxGeometry(2, 3.2, 0.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x2e1a12, roughness: 0.85 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.name = 'manor_door';
  door.position.set(0, 1.6, 4.05);
  door.castShadow = true;
  manorGroup.add(door);

  // Heurtoir en fer forgé
  const knocker = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 6, 12), timberMat);
  knocker.position.set(0, 1.8, 4.18);
  knocker.rotation.y = Math.PI / 2;
  manorGroup.add(knocker);

  // 5. Fenêtres gothiques cintrées luminescentes
  const makeGothicWindow = (x: number, y: number, z: number, mat: THREE.Material, isAmberRelic = false) => {
    const winGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.2, 2.2, 0.2);
    const frameMat = timberMat;
    const frame = new THREE.Mesh(frameGeo, frameMat);
    const paneGeo = new THREE.PlaneGeometry(0.9, 1.8);
    const pane = new THREE.Mesh(paneGeo, mat);
    pane.position.z = 0.12;

    if (isAmberRelic) {
      winGroup.userData = { relicId: 'stained_glass' };
      pane.userData = { relicId: 'stained_glass' };
      frame.userData = { relicId: 'stained_glass' };
    }

    winGroup.add(frame, pane);
    winGroup.position.set(x, y, z);
    return winGroup;
  };

  // Fenêtres avant (celle de gauche en ambre est la relique du vitrail)
  manorGroup.add(makeGothicWindow(-2.8, 5.5, 4.02, windowGlowAmber, true));
  manorGroup.add(makeGothicWindow(2.8, 5.5, 4.02, windowGlowGreen, false));
  // Fenêtre de la tour
  const towerWin = makeGothicWindow(5.5, 12, 3.1, windowGlowPurple, false);
  manorGroup.add(towerWin);

  // 6. Cheminée en pierres sombres avec couronnement
  const chimneyGeo = new THREE.BoxGeometry(1.2, 4.5, 1.2);
  const chimney = new THREE.Mesh(chimneyGeo, stoneMat);
  chimney.position.set(-3.5, 11, -1);
  chimney.castShadow = true;
  chimney.userData = { relicId: 'gargoyle_roof' };
  manorGroup.add(chimney);

  scene.add(manorGroup);
}

function buildGraveyard(scene: THREE.Scene) {
  const graveMat = new THREE.MeshStandardMaterial({
    color: 0x322d3e,
    roughness: 0.9,
    metalness: 0.1,
  });

  const mossMat = new THREE.MeshStandardMaterial({
    color: 0x243620,
    roughness: 0.95,
  });

  // Tombes variées disposées autour de la cour
  const graveConfigs = [
    { x: -7, z: 8, rotY: 0.15, rotZ: 0.08, type: 'arch' },
    { x: -9, z: 12, rotY: -0.2, rotZ: -0.1, type: 'cross' },
    { x: -5, z: 14, rotY: 0.05, rotZ: 0.04, type: 'stone' },
    { x: 8, z: 7, rotY: -0.12, rotZ: 0.06, type: 'arch' },
    { x: 9.5, z: 12, rotY: 0.22, rotZ: -0.05, type: 'cross' },
  ];

  graveConfigs.forEach((cfg) => {
    const graveGroup = new THREE.Group();
    graveGroup.name = 'grave_tombstone';

    if (cfg.type === 'cross') {
      graveGroup.userData = { relicId: 'celtic_cross' };
      const vert = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, 0.25), graveMat);
      vert.position.y = 1.1;
      vert.userData = { relicId: 'celtic_cross' };
      const horiz = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.25), graveMat);
      horiz.position.y = 1.6;
      horiz.userData = { relicId: 'celtic_cross' };
      vert.castShadow = true;
      horiz.castShadow = true;
      graveGroup.add(vert, horiz);
    } else if (cfg.type === 'arch') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.3), graveMat);
      base.position.y = 0.8;
      const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.3, 12, 1, false, 0, Math.PI), graveMat);
      arch.rotation.z = Math.PI / 2;
      arch.position.y = 1.6;
      base.castShadow = true;
      arch.castShadow = true;
      graveGroup.add(base, arch);
    } else {
      const stone = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.35), mossMat);
      stone.position.y = 0.7;
      stone.castShadow = true;
      graveGroup.add(stone);
    }

    // Tertre de terre fraîche
    const mound = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.3, 8), mossMat);
    mound.position.set(0, 0.1, 0.6);
    graveGroup.add(mound);

    graveGroup.position.set(cfg.x, 0, cfg.z);
    graveGroup.rotation.y = cfg.rotY;
    graveGroup.rotation.z = cfg.rotZ;
    scene.add(graveGroup);
  });

  // Arbres morts tordus
  buildCreepyTree(scene, -12, 4);
  buildCreepyTree(scene, 12, 3);
}

function buildCreepyTree(scene: THREE.Scene, x: number, z: number) {
  const treeGroup = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x16101c, roughness: 0.95 });

  // Tronc tordu
  const trunkGeo = new THREE.CylinderGeometry(0.4, 0.9, 7, 8);
  const trunk = new THREE.Mesh(trunkGeo, woodMat);
  trunk.position.y = 3.5;
  trunk.rotation.z = (Math.random() - 0.5) * 0.2;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Branches noueuses
  for (let i = 0; i < 5; i++) {
    const branchGeo = new THREE.CylinderGeometry(0.12, 0.3, 3.5, 6);
    const branch = new THREE.Mesh(branchGeo, woodMat);
    branch.position.set(0, 4.5 + i * 0.5, 0);
    branch.rotation.z = (Math.PI / 4) * (i % 2 === 0 ? 1 : -1) + (Math.random() - 0.5) * 0.3;
    branch.rotation.y = (i * Math.PI) / 2.5;
    branch.castShadow = true;
    treeGroup.add(branch);
  }

  treeGroup.position.set(x, 0, z);
  scene.add(treeGroup);
}

function buildJackOLanterns(
  scene: THREE.Scene,
  pumpkinsRef: React.MutableRefObject<Array<{ group: THREE.Group; baseRotSpeed: number }>>
) {
  const pumpkinMat = new THREE.MeshStandardMaterial({
    color: 0xff7518,
    roughness: 0.55,
    metalness: 0.1,
  });

  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x385721,
    roughness: 0.85,
  });

  const faceMat = new THREE.MeshBasicMaterial({
    color: 0xffea88,
  });

  const configs = [
    { x: -3.5, z: 9, scale: 0.95, speed: 0.4 },
    { x: 3.5, z: 10.5, scale: 1.1, speed: -0.3 },
    { x: 1.2, z: 14.5, scale: 0.8, speed: 0.5 },
  ];

  pumpkinsRef.current = [];

  configs.forEach((cfg) => {
    const pGroup = new THREE.Group();
    pGroup.name = 'carved_pumpkin';
    pGroup.userData = { relicId: 'porch_pumpkin' };

    // Corps côtelé de citrouille composé de 6 ellipses assemblées
    const bodyGroup = new THREE.Group();
    bodyGroup.userData = { relicId: 'porch_pumpkin' };
    for (let i = 0; i < 6; i++) {
      const sliceGeo = new THREE.SphereGeometry(1.0, 16, 16);
      sliceGeo.scale(1.05, 0.85, 0.95);
      const slice = new THREE.Mesh(sliceGeo, pumpkinMat);
      slice.rotation.y = (i * Math.PI) / 3;
      slice.castShadow = true;
      slice.userData = { relicId: 'porch_pumpkin' };
      bodyGroup.add(slice);
    }
    pGroup.add(bodyGroup);

    // Pédoncule tordu au sommet
    const stemGeo = new THREE.CylinderGeometry(0.1, 0.18, 0.8, 6);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.95, 0);
    stem.rotation.z = 0.25;
    pGroup.add(stem);

    // Visage découpé lumineux (yeux triangulaires et bouche édentée)
    const eyeGeo = new THREE.ConeGeometry(0.18, 0.1, 3);
    const leftEye = new THREE.Mesh(eyeGeo, faceMat);
    leftEye.rotation.x = Math.PI / 2;
    leftEye.rotation.z = Math.PI;
    leftEye.position.set(-0.35, 0.2, 0.95);

    const rightEye = new THREE.Mesh(eyeGeo, faceMat);
    rightEye.rotation.x = Math.PI / 2;
    rightEye.rotation.z = Math.PI;
    rightEye.position.set(0.35, 0.2, 0.95);

    // Bouche découpée
    const mouthGeo = new THREE.TorusGeometry(0.4, 0.08, 6, 12, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, faceMat);
    mouth.rotation.x = Math.PI;
    mouth.position.set(0, -0.2, 0.94);

    pGroup.add(leftEye, rightEye, mouth);

    pGroup.position.set(cfg.x, 1.0, cfg.z);
    pGroup.scale.set(cfg.scale, cfg.scale, cfg.scale);

    scene.add(pGroup);
    pumpkinsRef.current.push({
      group: pGroup,
      baseRotSpeed: cfg.speed,
    });
  });
}

function buildBats(
  scene: THREE.Scene,
  batsRef: React.MutableRefObject<Array<{
    group: THREE.Group;
    leftWing: THREE.Mesh;
    rightWing: THREE.Mesh;
    radius: number;
    height: number;
    speed: number;
    angle: number;
    verticalPhase: number;
  }>>
) {
  const batMat = new THREE.MeshStandardMaterial({
    color: 0x181222,
    roughness: 0.85,
    metalness: 0.15,
  });

  const batConfigs = [
    { radius: 10, height: 16, speed: 1.1, phase: 0 },
    { radius: 14, height: 19, speed: 0.85, phase: 1.5 },
    { radius: 7, height: 14, speed: 1.4, phase: 3.0 },
    { radius: 12, height: 17, speed: 0.95, phase: 4.5 },
  ];

  batsRef.current = [];

  batConfigs.forEach((cfg, idx) => {
    const batGroup = new THREE.Group();
    batGroup.name = `bat_${idx}`;
    batGroup.userData = { relicId: 'bat_sentinel' };

    // Corps de la chauve-souris
    const bodyGeo = new THREE.SphereGeometry(0.35, 8, 8);
    bodyGeo.scale(0.8, 1.2, 0.7);
    const body = new THREE.Mesh(bodyGeo, batMat);
    body.userData = { relicId: 'bat_sentinel' };
    batGroup.add(body);

    // Tête avec petites oreilles pointues
    const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const head = new THREE.Mesh(headGeo, batMat);
    head.position.set(0, 0.35, 0.15);

    const earGeo = new THREE.ConeGeometry(0.08, 0.2, 3);
    const leftEar = new THREE.Mesh(earGeo, batMat);
    leftEar.position.set(-0.12, 0.5, 0.15);
    const rightEar = new THREE.Mesh(earGeo, batMat);
    rightEar.position.set(0.12, 0.5, 0.15);
    batGroup.add(head, leftEar, rightEar);

    // Yeux rouges luisants
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
    const eyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.08, 0.37, 0.32);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.08, 0.37, 0.32);
    batGroup.add(eyeL, eyeR);

    // Aile gauche articulée
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-1.2, 0.5);
    wingShape.lineTo(-1.5, 0.1);
    wingShape.lineTo(-1.1, -0.4);
    wingShape.lineTo(-0.6, -0.2);
    wingShape.lineTo(0, -0.1);
    wingShape.closePath();

    const wingGeo = new THREE.ShapeGeometry(wingShape);
    const leftWing = new THREE.Mesh(wingGeo, batMat);
    leftWing.position.set(-0.25, 0.1, 0);
    leftWing.rotation.x = Math.PI / 2;

    // Aile droite (inversée)
    const rightWingGeo = wingGeo.clone();
    rightWingGeo.scale(-1, 1, 1);
    const rightWing = new THREE.Mesh(rightWingGeo, batMat);
    rightWing.position.set(0.25, 0.1, 0);
    rightWing.rotation.x = Math.PI / 2;

    batGroup.add(leftWing, rightWing);
    scene.add(batGroup);

    batsRef.current.push({
      group: batGroup,
      leftWing,
      rightWing,
      radius: cfg.radius,
      height: cfg.height,
      speed: cfg.speed,
      angle: cfg.phase,
      verticalPhase: cfg.phase,
    });
  });
}

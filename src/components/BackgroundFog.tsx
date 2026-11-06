import React, { useEffect, useRef } from 'react';

interface BackgroundFogProps {
  intensity?: 1 | 2 | 3;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  type: 'ember' | 'pumpkin_spark' | 'bone_dust';
}

interface Bat {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  wingAngle: number;
  wingSpeed: number;
}

interface GhostWisp {
  x: number;
  y: number;
  vy: number;
  phase: number;
  size: number;
  alpha: number;
}

export const BackgroundFog: React.FC<BackgroundFogProps> = ({ intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialisation des particules
    const particleCount = intensity === 3 ? 55 : intensity === 2 ? 38 : 26;
    const particles: Particle[] = [];
    const colors = ['rgba(255, 117, 24, ', 'rgba(57, 255, 20, ', 'rgba(106, 13, 173, ', 'rgba(255, 215, 0, '];

    for (let i = 0; i < particleCount; i++) {
      const pType: 'ember' | 'pumpkin_spark' | 'bone_dust' =
        Math.random() > 0.65 ? 'pumpkin_spark' : Math.random() > 0.35 ? 'ember' : 'bone_dust';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: pType === 'pumpkin_spark' ? Math.random() * 3.5 + 2 : Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -Math.random() * 0.6 - 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: pType,
      });
    }

    // Chauves-souris en vol
    const batCount = intensity === 3 ? 7 : intensity === 2 ? 5 : 4;
    const bats: Bat[] = [];
    for (let i = 0; i < batCount; i++) {
      bats.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.55),
        vx: (Math.random() * 1.8 + 0.9) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 0.6,
        scale: Math.random() * 0.5 + 0.55,
        wingAngle: Math.random() * Math.PI,
        wingSpeed: Math.random() * 0.25 + 0.18,
      });
    }

    // Esprits spectraux flottants (Ghost Wisps)
    const wisps: GhostWisp[] = [];
    for (let i = 0; i < 4; i++) {
      wisps.push({
        x: Math.random() * width,
        y: height + Math.random() * 100,
        vy: -Math.random() * 0.4 - 0.25,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 18 + 14,
        alpha: Math.random() * 0.3 + 0.15,
      });
    }

    // Éclairs spectraux aléatoires
    let lightningTimer = 0;
    let lightningFlash = 0;

    let time = 0;

    const drawBat = (bat: Bat) => {
      ctx.save();
      ctx.translate(bat.x, bat.y);
      if (bat.vx < 0) ctx.scale(-1, 1);
      ctx.scale(bat.scale, bat.scale);

      bat.wingAngle += bat.wingSpeed;
      const wingY = Math.sin(bat.wingAngle) * 7;

      ctx.fillStyle = '#140A1E';
      ctx.beginPath();
      // Corps
      ctx.ellipse(0, 0, 4.5, 9, 0, 0, Math.PI * 2);
      // Aile gauche
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(-15, -14 + wingY, -24, -4 + wingY);
      ctx.quadraticCurveTo(-15, 5, -2, 4);
      // Aile droite
      ctx.moveTo(2, 0);
      ctx.quadraticCurveTo(15, -14 + wingY, 24, -4 + wingY);
      ctx.quadraticCurveTo(15, 5, 2, 4);
      ctx.fill();

      // Yeux rouge rubis incandescents
      ctx.fillStyle = '#FF3B30';
      ctx.shadowColor = '#FF3B30';
      ctx.shadowBlur = 4;
      ctx.fillRect(-2, -3, 1.2, 1.2);
      ctx.fillRect(1, -3, 1.2, 1.2);
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    const drawGhostWisp = (wisp: GhostWisp) => {
      ctx.save();
      const waveX = wisp.x + Math.sin(wisp.phase) * 35;
      ctx.translate(waveX, wisp.y);

      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, wisp.size);
      grad.addColorStop(0, `rgba(57, 255, 20, ${wisp.alpha * 1.5})`);
      grad.addColorStop(0.5, `rgba(106, 13, 173, ${wisp.alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, wisp.size, 0, Math.PI * 2);
      ctx.fill();

      // Petits yeux du spectre
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-3, -2, 2, 3);
      ctx.fillRect(1, -2, 2, 3);

      ctx.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.01;

      ctx.clearRect(0, 0, width, height);

      // 1. Fond brumeux spectral avec gradients
      const fogGrad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time) * 50,
        height * 0.4 + Math.cos(time * 0.8) * 35,
        60,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );

      const fogAlpha = intensity === 3 ? 0.25 : intensity === 2 ? 0.18 : 0.12;
      fogGrad.addColorStop(0, `rgba(106, 13, 173, ${fogAlpha})`);
      fogGrad.addColorStop(0.4, `rgba(28, 12, 44, ${fogAlpha * 0.75})`);
      fogGrad.addColorStop(1, 'rgba(11, 11, 11, 0)');

      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, width, height);

      // Éclairs aléatoires
      lightningTimer++;
      if (lightningTimer > 350 + Math.random() * 250) {
        lightningFlash = 0.35;
        lightningTimer = 0;
      }
      if (lightningFlash > 0.01) {
        ctx.fillStyle = `rgba(140, 50, 220, ${lightningFlash})`;
        ctx.fillRect(0, 0, width, height);
        lightningFlash *= 0.88;
      }

      // 2. Esprits spectraux
      for (const w of wisps) {
        w.y += w.vy;
        w.phase += 0.03;
        if (w.y < -50) {
          w.y = height + 50;
          w.x = Math.random() * width;
        }
        drawGhostWisp(w);
      }

      // 3. Particules d'Halloween (braises, étincelles citrouilles et poussière d'os)
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === 'pumpkin_spark') {
          // Lueur orange chaude
          ctx.fillStyle = `rgba(255, 117, 24, ${p.alpha})`;
          ctx.shadowColor = '#FF7518';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === 'ember') {
          // Lueur verte toxique
          ctx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
          ctx.shadowColor = '#39FF14';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Poussière d'os blanche/violette
          ctx.fillStyle = `rgba(223, 183, 255, ${p.alpha * 0.7})`;
          ctx.fill();
        }
      }

      // 4. Chauves-souris
      for (const bat of bats) {
        bat.x += bat.vx;
        bat.y += bat.vy;

        if (bat.vx > 0 && bat.x > width + 60) {
          bat.x = -60;
          bat.y = Math.random() * (height * 0.6);
        } else if (bat.vx < 0 && bat.x < -60) {
          bat.x = width + 60;
          bat.y = Math.random() * (height * 0.6);
        }

        drawBat(bat);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
};

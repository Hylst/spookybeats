import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SpiderEntity,
  PumpkinEntity,
  BatEntity,
  WitchEntity,
  createInitialSpiders,
  updateSpider,
  pokeSpider,
  createInitialPumpkins,
  updatePumpkinPhysics,
  launchPumpkinJump,
  createInitialBats,
  updateBatFlight,
  scatterBat,
  createInitialWitch,
  startWitchFlight,
  updateWitchFlight,
  triggerWitchLoop,
} from '../game/creaturesLogic';
import {
  playSpiderSilkChitter,
  playPumpkinBounce,
  playBatSwarmFlap,
  playWitchFlightSwoosh,
  playDoorCreak,
} from '../audio/sfx';

interface GothicCreaturesOverlayProps {
  intensity?: number;
}

export const GothicCreaturesOverlay: React.FC<GothicCreaturesOverlayProps> = ({
  intensity = 1,
}) => {
  // Visibilité paramétrable par l'utilisateur
  const [showSpiders, setShowSpiders] = useState(true);
  const [showPumpkins, setShowPumpkins] = useState(true);
  const [showBats, setShowBats] = useState(true);
  const [showWitch, setShowWitch] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Entités vivantes
  const [spiders, setSpiders] = useState<SpiderEntity[]>(createInitialSpiders);
  const [pumpkins, setPumpkins] = useState<PumpkinEntity[]>(createInitialPumpkins);
  const [bats, setBats] = useState<BatEntity[]>(createInitialBats);
  const [witch, setWitch] = useState<WitchEntity>(createInitialWitch);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const witchTimerRef = useRef<number | null>(null);

  // Programmation d'un passage périodique de la sorcière dans le ciel nocturne
  useEffect(() => {
    const scheduleNextFlight = () => {
      const delay = 35000 + Math.random() * 25000; // 35 à 60 secondes
      witchTimerRef.current = window.setTimeout(() => {
        if (showWitch) {
          setWitch((prev) => {
            playWitchFlightSwoosh(false);
            return startWitchFlight(prev, 12 + Math.random() * 12);
          });
        }
        scheduleNextFlight();
      }, delay);
    };

    scheduleNextFlight();
    return () => {
      if (witchTimerRef.current) clearTimeout(witchTimerRef.current);
    };
  }, [showWitch]);

  // Boucle d'animation fluide 60fps
  const animate = useCallback(() => {
    const now = performance.now();
    const timeSec = now / 1000;

    // Mise à jour physique des araignées
    if (showSpiders) {
      setSpiders((prev) => prev.map((s) => updateSpider(s, timeSec)));
    }

    // Mise à jour physique des citrouilles (rebonds et squash)
    if (showPumpkins) {
      setPumpkins((prev) =>
        prev.map((p) => updatePumpkinPhysics(p, 0.95, 0.82))
      );
    }

    // Mise à jour de vol des chauves-souris
    if (showBats) {
      setBats((prev) => prev.map((b) => updateBatFlight(b, timeSec)));
    }

    // Mise à jour de vol de la sorcière
    setWitch((prev) => {
      if (!prev.active) return prev;
      return updateWitchFlight(prev);
    });

    lastTimeRef.current = now;
    requestRef.current = requestAnimationFrame(animate);
  }, [showSpiders, showPumpkins, showBats]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Actions interactives utilisateur
  const handlePokeSpider = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSpiderSilkChitter(true);
    setSpiders((prev) =>
      prev.map((s) => (s.id === id ? pokeSpider(s) : s))
    );
  };

  const handleBouncePumpkin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPumpkinBounce(true);
    setPumpkins((prev) =>
      prev.map((p) => (p.id === id ? launchPumpkinJump(p, 19) : p))
    );
  };

  const handleScatterBat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playBatSwarmFlap(true);
    setBats((prev) =>
      prev.map((b) => (b.id === id ? scatterBat(b) : b))
    );
  };

  const handleWitchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playWitchFlightSwoosh(true);
    setWitch((prev) => triggerWitchLoop(prev));
  };

  // Déclencheurs globaux manuels
  const triggerAllSpiders = () => {
    playSpiderSilkChitter(true);
    setSpiders((prev) => prev.map(pokeSpider));
  };

  const triggerAllPumpkins = () => {
    playPumpkinBounce(true);
    setPumpkins((prev) => prev.map((p) => launchPumpkinJump(p, 18)));
  };

  const triggerAllBats = () => {
    playBatSwarmFlap(true);
    setBats((prev) => prev.map(scatterBat));
  };

  const summonWitchNow = () => {
    playWitchFlightSwoosh(true);
    setWitch((prev) => startWitchFlight(prev, 14 + Math.random() * 8));
  };

  return (
    <div
      aria-hidden="false"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* 1. ARAIGNÉES TISSEUSES DE TOILE (Haut d'écran et bords)    */}
      {/* ========================================================= */}
      {showSpiders &&
        spiders.map((spider) => (
          <div
            key={spider.id}
            className="absolute top-0 pointer-events-auto cursor-pointer transition-transform duration-75"
            style={{
              left: `${spider.xPercent}%`,
              transform: `translate(-50%, 0) rotate(${spider.swayAngle}deg)`,
              transformOrigin: 'top center',
            }}
            onClick={(e) => handlePokeSpider(spider.id, e)}
            title="Touchez l'araignée pour la faire remonter en tissant sa toile !"
          >
            {/* Ligne de fil de soie argenté étincelant */}
            <svg
              width="24"
              height={spider.yPx}
              className="overflow-visible"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id={`silkGrad-${spider.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DFB7FF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#E6E1DC" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#39FF14" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Fil principal */}
              <line
                x1="12"
                y1="0"
                x2="12"
                y2={spider.yPx}
                stroke={`url(#silkGrad-${spider.id})`}
                strokeWidth={spider.state === 'scuttled' ? '1.8' : '1.1'}
                strokeDasharray={spider.state === 'scuttled' ? '4 2' : 'none'}
              />
              {/* Petites gouttelettes de rosée/toile */}
              <circle cx="12" cy={spider.yPx * 0.3} r="1" fill="#DFB7FF" opacity="0.6" />
              <circle cx="12" cy={spider.yPx * 0.7} r="1.2" fill="#39FF14" opacity="0.7" />
            </svg>

            {/* Corps d'araignée gothique sculptée avec 8 pattes articulées */}
            <div
              className={`relative -mt-1 group transition-transform ${
                spider.state === 'scuttled' ? 'scale-110' : 'hover:scale-125'
              }`}
              style={{ width: 34, height: 34, marginLeft: -5 }}
            >
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                {/* 4 Pattes gauches articulées */}
                <path
                  d="M13,16 Q6,10 2,12"
                  stroke="#A855F7"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className={spider.state === 'scuttled' ? 'animate-pulse' : ''}
                />
                <path
                  d="M13,18 Q4,16 1,20"
                  stroke="#7E22CE"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M13,20 Q5,24 3,28"
                  stroke="#A855F7"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M14,22 Q8,29 6,33"
                  stroke="#581C87"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* 4 Pattes droites articulées */}
                <path
                  d="M21,16 Q28,10 32,12"
                  stroke="#A855F7"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className={spider.state === 'scuttled' ? 'animate-pulse' : ''}
                />
                <path
                  d="M21,18 Q30,16 33,20"
                  stroke="#7E22CE"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M21,20 Q29,24 31,28"
                  stroke="#A855F7"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M20,22 Q26,29 28,33"
                  stroke="#581C87"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* Céphalothorax (tête) */}
                <circle cx="17" cy="15" r="3.2" fill="#1C1424" stroke="#6A0DAD" strokeWidth="1" />

                {/* Yeux d'araignée luisants rouge/ambre */}
                <circle cx="15.8" cy="14" r="0.65" fill="#FF7518" />
                <circle cx="18.2" cy="14" r="0.65" fill="#FF7518" />
                <circle cx="14.8" cy="15" r="0.45" fill="#39FF14" />
                <circle cx="19.2" cy="15" r="0.45" fill="#39FF14" />

                {/* Abdomen orné d'un crâne mystique ou sablier pourpre */}
                <ellipse cx="17" cy="22" rx="4.8" ry="6.2" fill="#120A1D" stroke="#DFB7FF" strokeWidth="0.9" />
                {/* Rune spectrale au dos de l'araignée */}
                <path
                  d="M17,18 L17,25 M15,20 L19,20 M15.5,23 L18.5,23"
                  stroke="#39FF14"
                  strokeWidth="0.8"
                  opacity="0.85"
                />
              </svg>

              {/* Bulle d'action ludique au clic */}
              {spider.state === 'scuttled' && (
                <span className="absolute -top-6 -left-3 text-[10px] font-mono font-bold text-[#39FF14] bg-black/80 px-1 py-0.5 rounded border border-[#6A0DAD] whitespace-nowrap animate-bounce">
                  🕸️ Tisse !
                </span>
              )}
            </div>
          </div>
        ))}

      {/* ========================================================= */}
      {/* 2. CHAUVES-SOURIS VIREVOLTANTES (Ciel nocturne)           */}
      {/* ========================================================= */}
      {showBats &&
        bats.map((bat) => {
          // Calcul dynamique de l'amplitude du battement d'aile
          const wingScaleY = Math.cos(bat.wingPhase);
          return (
            <div
              key={bat.id}
              className="absolute pointer-events-auto cursor-pointer transition-transform duration-100 ease-out"
              style={{
                left: `${bat.xPercent}%`,
                top: `${bat.yPercent}%`,
                width: bat.size * 1.5,
                height: bat.size,
                transform: `translate(-50%, -50%) ${bat.vx < 0 ? 'scaleX(-1)' : 'scaleX(1)'}`,
              }}
              onClick={(e) => handleScatterBat(bat.id, e)}
              title="Cliquez pour effrayer la chauve-souris !"
            >
              <svg
                width={bat.size * 1.5}
                height={bat.size}
                viewBox="0 0 42 24"
                fill="none"
                className="overflow-visible filter drop-shadow-[0_2px_6px_rgba(106,13,173,0.6)]"
              >
                {/* Aile gauche battante */}
                <g style={{ transformOrigin: '21px 13px', transform: `scaleY(${wingScaleY})` }}>
                  <path
                    d="M21,13 Q14,2 4,6 Q8,15 14,14 Q18,20 21,13 Z"
                    fill="#1A1125"
                    stroke="#8B5CF6"
                    strokeWidth="1.2"
                  />
                  {/* Nervures membranaires en cuir */}
                  <line x1="21" y1="13" x2="6" y2="7" stroke="#6D28D9" strokeWidth="0.8" opacity="0.6" />
                  <line x1="21" y1="13" x2="13" y2="14" stroke="#6D28D9" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* Aile droite battante */}
                <g style={{ transformOrigin: '21px 13px', transform: `scaleY(${wingScaleY})` }}>
                  <path
                    d="M21,13 Q28,2 38,6 Q34,15 28,14 Q24,20 21,13 Z"
                    fill="#1A1125"
                    stroke="#8B5CF6"
                    strokeWidth="1.2"
                  />
                  <line x1="21" y1="13" x2="36" y2="7" stroke="#6D28D9" strokeWidth="0.8" opacity="0.6" />
                  <line x1="21" y1="13" x2="29" y2="14" stroke="#6D28D9" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* Corps central & oreilles pointues */}
                <ellipse cx="21" cy="13" rx="3.5" ry="5.5" fill="#0D0616" stroke="#DFB7FF" strokeWidth="0.8" />
                <polygon points="18.5,8 19.5,4 20.8,8" fill="#0D0616" stroke="#8B5CF6" strokeWidth="0.8" />
                <polygon points="23.5,8 22.5,4 21.2,8" fill="#0D0616" stroke="#8B5CF6" strokeWidth="0.8" />

                {/* Yeux incandescents de chauve-souris */}
                <circle cx="19.5" cy="11.5" r="0.9" fill="#FF7518" className="animate-ping" />
                <circle cx="22.5" cy="11.5" r="0.9" fill="#FF7518" />
              </svg>
            </div>
          );
        })}

      {/* ========================================================= */}
      {/* 3. SORCIÈRE SUR SON BALAI AVEC TRAÎNÉE MAGIQUE            */}
      {/* ========================================================= */}
      {showWitch && witch.active && (
        <div
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: `${witch.progress}%`,
            top: `${witch.yPercent}%`,
            transform: `translate(-50%, -50%) rotate(${witch.isDoingLoop ? witch.loopAngle : 0}deg)`,
            transition: witch.isDoingLoop ? 'none' : 'transform 0.1s ease-out',
            zIndex: 42,
          }}
          onClick={handleWitchClick}
          title="Cliquez sur la Sorcière pour lui faire exécuter une boucle magique !"
        >
          {/* Silhouette gothique de la Sorcière céleste */}
          <div className="relative group">
            <svg
              width="78"
              height="58"
              viewBox="0 0 78 58"
              fill="none"
              className="filter drop-shadow-[0_0_12px_rgba(106,13,173,0.8)] hover:brightness-125"
            >
              {/* Balai de sorcière (manche en bois tordu et brindilles) */}
              <line x1="8" y1="46" x2="68" y2="24" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="8" y1="46" x2="68" y2="24" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
              {/* Brindilles du balai avec lien noué */}
              <path
                d="M4,47 Q10,43 14,44 Q11,53 4,51 Q2,49 4,47 Z"
                fill="#D97706"
                stroke="#451A03"
                strokeWidth="1"
              />
              <line x1="12" y1="43" x2="10" y2="52" stroke="#FEF3C7" strokeWidth="1.5" />

              {/* Lanterne en laiton suspendue au bout du balai */}
              <line x1="64" y1="26" x2="64" y2="33" stroke="#F59E0B" strokeWidth="1" />
              <rect x="61" y="33" width="6" height="8" rx="1" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="64" cy="37" r="2" fill="#FBBF24" className="animate-pulse" />

              {/* Petit chat noir perché à l'arrière du balai */}
              <ellipse cx="21" cy="39" rx="3.5" ry="2.5" fill="#0A0512" stroke="#6D28D9" strokeWidth="0.7" />
              <circle cx="18" cy="37" r="2.2" fill="#0A0512" />
              <polygon points="17,35 16,33 18,34" fill="#0A0512" />
              <polygon points="19,35 20,33 18,34" fill="#0A0512" />
              <circle cx="17.5" cy="37" r="0.4" fill="#39FF14" />
              <path d="M24,39 Q28,37 27,33" stroke="#0A0512" strokeWidth="1.2" strokeLinecap="round" />

              {/* Cape en lambeaux flottant au vent */}
              <path
                d="M33,36 Q22,34 16,38 Q22,43 32,41 Z"
                fill="#3B0764"
                stroke="#7E22CE"
                strokeWidth="1.2"
              />
              <path
                d="M30,37 Q18,40 12,46 Q24,47 34,42 Z"
                fill="#1E0638"
                opacity="0.8"
              />

              {/* Corps de la sorcière */}
              <ellipse cx="38" cy="34" rx="5.5" ry="8" fill="#1C1424" stroke="#6A0DAD" strokeWidth="1" />

              {/* Tête & profil crochu */}
              <circle cx="43" cy="24" r="4.2" fill="#382142" stroke="#6A0DAD" strokeWidth="0.8" />
              {/* Nez crochu */}
              <polygon points="46.5,23 50,25 46.5,26" fill="#382142" />
              {/* Oeil brillant */}
              <circle cx="45" cy="23.5" r="0.8" fill="#FF7518" />

              {/* Grand chapeau de sorcière victorien pointu */}
              {/* Bord du chapeau */}
              <ellipse cx="43" cy="21" rx="12" ry="3.5" fill="#170C24" stroke="#9333EA" strokeWidth="1.2" />
              {/* Ruban du chapeau */}
              <rect x="36" y="17" width="14" height="3" fill="#D97706" />
              <rect x="42" y="17" width="3" height="3" fill="#FDE68A" />
              {/* Cône courbé du chapeau */}
              <path
                d="M36,18 Q41,9 50,4 Q45,13 48,18 Z"
                fill="#170C24"
                stroke="#9333EA"
                strokeWidth="1.2"
              />
            </svg>

            {/* Étiquette d'ambiance */}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider text-[#DFB7FF] bg-[#120722]/90 border border-[#7E22CE] px-1.5 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Sabbat Céleste
            </span>
          </div>
        </div>
      )}

      {/* Particules de traînée de stardust (étincelles de la sorcière) */}
      {showWitch &&
        witch.sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${sp.xPercent}%`,
              top: `${sp.yPercent}%`,
              width: sp.size,
              height: sp.size,
              opacity: sp.life,
              transform: `scale(${sp.life})`,
              backgroundColor:
                sp.color === 'violet'
                  ? '#DFB7FF'
                  : sp.color === 'amber'
                  ? '#FF7518'
                  : '#39FF14',
              boxShadow: `0 0 8px ${
                sp.color === 'violet'
                  ? '#9333EA'
                  : sp.color === 'amber'
                  ? '#EA580C'
                  : '#22C55E'
              }`,
            }}
          />
        ))}

      {/* ========================================================= */}
      {/* 4. CITROUILLES BONDISSANTES (Bas d'écran et coins)         */}
      {/* ========================================================= */}
      {showPumpkins &&
        pumpkins.map((pumpkin) => (
          <div
            key={pumpkin.id}
            className="absolute bottom-20 pointer-events-auto cursor-pointer select-none transition-transform"
            style={{
              left: `${pumpkin.xPercent}%`,
              transform: `translate(-50%, -${pumpkin.yPx}px) scale(${pumpkin.scaleX}, ${pumpkin.scaleY}) rotate(${pumpkin.rotDeg}deg)`,
              transformOrigin: 'bottom center',
              zIndex: 38,
            }}
            onClick={(e) => handleBouncePumpkin(pumpkin.id, e)}
            title="Cliquez pour faire bondir la citrouille avec son !"
          >
            {/* Ombre portée dynamique qui s'estompe quand la citrouille saute haut */}
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 filter blur-[2px] transition-all"
              style={{
                width: 38 * Math.max(0.2, 1 - pumpkin.yPx / 150),
                height: 8 * Math.max(0.1, 1 - pumpkin.yPx / 150),
                opacity: Math.max(0.1, 1 - pumpkin.yPx / 180),
              }}
            />

            {/* Jack-o'-Lantern vectorielle détaillée avec flamme intérieure */}
            <div className="relative group hover:brightness-125 transition-all">
              <svg width="46" height="42" viewBox="0 0 46 42" fill="none">
                <defs>
                  <radialGradient id={`flameGrad-${pumpkin.id}`} cx="50%" cy="60%" r="65%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="85%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#7C2D12" />
                  </radialGradient>
                </defs>

                {/* Queue / tige de citrouille tordue */}
                <path
                  d="M23,7 Q21,1 27,2"
                  stroke="#16A34A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M24,7 Q22,2 26,3"
                  stroke="#86EFAC"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* Lobes latéraux de la citrouille */}
                <ellipse cx="14" cy="25" rx="10" ry="14" fill="#C2410C" />
                <ellipse cx="32" cy="25" rx="10" ry="14" fill="#C2410C" />
                {/* Lobe central dominant */}
                <ellipse cx="23" cy="25" rx="13" ry="15" fill={`url(#flameGrad-${pumpkin.id})`} />

                {/* Tranches d'ombre sculptées */}
                <path d="M23,10 Q14,20 14,31 Q14,39 23,40" stroke="#7C2D12" strokeWidth="1.4" fill="none" opacity="0.4" />
                <path d="M23,10 Q32,20 32,31 Q32,39 23,40" stroke="#7C2D12" strokeWidth="1.4" fill="none" opacity="0.4" />

                {/* Visage découpé selon la variante */}
                {pumpkin.faceVariant === 'sinister' && (
                  <>
                    {/* Yeux triangulaires menaçants */}
                    <polygon points="15,19 20,24 16,25" fill="#1C0B02" />
                    <polygon points="31,19 26,24 30,25" fill="#1C0B02" />
                    <circle cx="17.5" cy="22" r="1" fill="#FEF08A" className="animate-pulse" />
                    <circle cx="28.5" cy="22" r="1" fill="#FEF08A" className="animate-pulse" />
                    {/* Nez taillé */}
                    <polygon points="23,24 21,27 25,27" fill="#1C0B02" />
                    {/* Bouche acérée */}
                    <path
                      d="M13,31 Q18,37 23,37 Q28,37 33,31 Q28,34 23,34 Q18,34 13,31 Z"
                      fill="#1C0B02"
                    />
                    <polygon points="18,32 19,34 20,32" fill="#FEF08A" />
                    <polygon points="26,32 27,34 28,32" fill="#FEF08A" />
                  </>
                )}

                {pumpkin.faceVariant === 'grinning' && (
                  <>
                    {/* Yeux larges et rieurs */}
                    <path d="M14,20 Q18,17 21,23 Q17,24 14,20 Z" fill="#1C0B02" />
                    <path d="M32,20 Q28,17 25,23 Q29,24 32,20 Z" fill="#1C0B02" />
                    <circle cx="18" cy="21" r="1" fill="#FEF08A" />
                    <circle cx="28" cy="21" r="1" fill="#FEF08A" />
                    {/* Large sourire à dents carrées */}
                    <path
                      d="M12,28 Q23,42 34,28 Q23,35 12,28 Z"
                      fill="#1C0B02"
                    />
                    <rect x="18" y="30" width="3" height="3" fill="#FEF08A" />
                    <rect x="25" y="31" width="3" height="3" fill="#FEF08A" />
                  </>
                )}

                {pumpkin.faceVariant === 'maniacal' && (
                  <>
                    {/* Yeux en flamme démoniaque */}
                    <polygon points="14,18 21,22 18,25 15,22" fill="#1C0B02" />
                    <polygon points="32,18 25,22 28,25 31,22" fill="#1C0B02" />
                    <circle cx="17" cy="21" r="1.3" fill="#39FF14" className="animate-ping" />
                    <circle cx="29" cy="21" r="1.3" fill="#39FF14" className="animate-ping" />
                    {/* Dentition pointue en zigzag */}
                    <path
                      d="M11,30 L15,35 L19,30 L23,36 L27,30 L31,35 L35,30 Q23,40 11,30 Z"
                      fill="#1C0B02"
                    />
                    <polygon points="21,31 23,35 25,31" fill="#39FF14" />
                  </>
                )}
              </svg>

              {/* Compteur de rebonds ludique */}
              {pumpkin.bounceCount > 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#FF7518] bg-black/75 px-1 rounded border border-[#C2410C]">
                  x{pumpkin.bounceCount}
                </span>
              )}
            </div>
          </div>
        ))}

      {/* ========================================================= */}
      {/* 5. DOCK ORNEMENTAL DE CONTRÔLE GOTHIOQUE (Bas-droite)      */}
      {/* ========================================================= */}
      <div className="fixed bottom-20 right-3 z-50 pointer-events-auto flex flex-col items-end gap-2">
        {/* Panneau dépliable des Sortilèges & Faune */}
        {isPanelOpen && (
          <div className="w-64 p-3 rounded-lg bg-[#0E0618]/95 border border-[#6A0DAD] shadow-[0_0_30px_rgba(106,13,173,0.6)] backdrop-blur-md text-[#E6E1DC] text-xs font-serif animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Titre avec filigrane victorien */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#6A0DAD]/40">
              <span className="font-gothic text-xs tracking-wider text-[#DFB7FF] flex items-center gap-1.5 font-bold">
                <span>🦇</span> Faune & Sortilèges
              </span>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="text-[#8C8494] hover:text-[#FF7518] p-1 text-sm leading-none"
                aria-label="Fermer le panneau des créatures"
              >
                ✕
              </button>
            </div>

            {/* Interrupteurs de présence */}
            <div className="space-y-1.5 mb-3 font-mono text-[11px]">
              <label className="flex items-center justify-between cursor-pointer hover:text-[#39FF14]">
                <span className="flex items-center gap-1.5">
                  <span>🕷️</span> Araignées tisseuses
                </span>
                <input
                  type="checkbox"
                  checked={showSpiders}
                  onChange={(e) => setShowSpiders(e.target.checked)}
                  className="accent-[#6A0DAD] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#39FF14]">
                <span className="flex items-center gap-1.5">
                  <span>🎃</span> Citrouilles bondissantes
                </span>
                <input
                  type="checkbox"
                  checked={showPumpkins}
                  onChange={(e) => setShowPumpkins(e.target.checked)}
                  className="accent-[#FF7518] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#39FF14]">
                <span className="flex items-center gap-1.5">
                  <span>🦇</span> Chauves-souris de crypte
                </span>
                <input
                  type="checkbox"
                  checked={showBats}
                  onChange={(e) => setShowBats(e.target.checked)}
                  className="accent-[#6A0DAD] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-[#39FF14]">
                <span className="flex items-center gap-1.5">
                  <span>🧹</span> Sorcière céleste
                </span>
                <input
                  type="checkbox"
                  checked={showWitch}
                  onChange={(e) => setShowWitch(e.target.checked)}
                  className="accent-[#DFB7FF] cursor-pointer"
                />
              </label>
            </div>

            {/* Boutons d'actions immédiates (rituels interactifs) */}
            <div className="pt-2 border-t border-[#6A0DAD]/30 grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <button
                onClick={summonWitchNow}
                className="px-2 py-1.5 bg-[#2B0E44] hover:bg-[#3D1460] text-[#DFB7FF] border border-[#7E22CE] rounded flex items-center justify-center gap-1 transition-all"
                title="Faire voler immédiatement la sorcière sur son balai"
              >
                <span>🧹</span> Vol Céleste
              </button>

              <button
                onClick={triggerAllPumpkins}
                className="px-2 py-1.5 bg-[#3B1705] hover:bg-[#522108] text-[#FF7518] border border-[#C2410C] rounded flex items-center justify-center gap-1 transition-all"
                title="Faire sauter toutes les citrouilles ensemble"
              >
                <span>🎃</span> Rebond Total
              </button>

              <button
                onClick={triggerAllBats}
                className="px-2 py-1.5 bg-[#1B0B2E] hover:bg-[#2B1248] text-[#C084FC] border border-[#6B21A8] rounded flex items-center justify-center gap-1 transition-all"
                title="Faire virevolter la nuée de chauves-souris"
              >
                <span>🦇</span> Nuée d'Ailes
              </button>

              <button
                onClick={triggerAllSpiders}
                className="px-2 py-1.5 bg-[#121B13] hover:bg-[#1B291D] text-[#39FF14] border border-[#15803D] rounded flex items-center justify-center gap-1 transition-all"
                title="Faire remonter et tisser toutes les toiles"
              >
                <span>🕸️</span> Toiles d'Or
              </button>
            </div>
          </div>
        )}

        {/* Bouton icône discret d'ouverture du dock */}
        <button
          onClick={() => {
            playDoorCreak(false);
            setIsPanelOpen(!isPanelOpen);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${
            isPanelOpen
              ? 'bg-[#6A0DAD] text-white border-[#DFB7FF] shadow-[0_0_15px_rgba(106,13,173,0.8)]'
              : 'bg-[#150B24]/90 text-[#DFB7FF] border-[#6A0DAD]/60 hover:border-[#FF7518] hover:text-[#FF7518] shadow-[0_0_10px_rgba(0,0,0,0.8)]'
          }`}
          aria-label="Contrôle des créatures gothiques et sortilèges"
          title="Ouvrir le menu de la Faune Nocturne & Sortilèges"
        >
          <span className="text-sm">🕸️</span>
          <span className="text-[11px] font-mono tracking-wider font-semibold">
            {isPanelOpen ? 'Fermer Sortilèges' : 'Faune Nocturne'}
          </span>
        </button>
      </div>
    </div>
  );
};

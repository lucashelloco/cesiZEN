"use client";

import { useEffect, useRef, useState } from "react";

type Config = {
  nom: string;
  nombreCycles: number;
  tempsInspiration: number;
  tempsApnee: number;
  tempsExpiration: number;
};

type Phase = "inspiration" | "apnee" | "expiration";

type Props = {
  config: Config;
  onStop: () => void;
};

const PHASE_LABELS: Record<Phase, string> = {
  inspiration: "Inspirez",
  apnee: "Retenez",
  expiration: "Expirez",
};

const PHASE_COLORS: Record<Phase, { bg: string; border: string; text: string }> = {
  inspiration: { bg: "#52a45220", border: "#52a452", text: "#52a452" },
  apnee: { bg: "#2ab5a020", border: "#2ab5a0", text: "#2ab5a0" },
  expiration: { bg: "#f2c94c20", border: "#f2c94c", text: "#f2c94c" },
};

const CIRCUMFERENCE = 2 * Math.PI * 120;

export function ExerciceTimer({ config, onStop }: Props) {
  const { nombreCycles, tempsInspiration, tempsApnee, tempsExpiration } = config;

  const inspiMs = tempsInspiration * 1000;
  const apneeMs = tempsApnee * 1000;
  const expiMs = tempsExpiration * 1000;
  const totalMs = inspiMs + apneeMs + expiMs;

  const [phase, setPhase] = useState<Phase>("inspiration");
  const [timeLeft, setTimeLeft] = useState(tempsInspiration);
  const [cycle, setCycle] = useState(1);
  const [finished, setFinished] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [exerciseStarted, setExerciseStarted] = useState(false);

  const circleRef = useRef<SVGCircleElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Countdown
  useEffect(() => {
    if (exerciseStarted) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setExerciseStarted(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [exerciseStarted]);

  // RAF — un seul cercle continu sur toute la durée du cycle
  useEffect(() => {
    if (!exerciseStarted) return;

    let rafId: number;
    let cycleStartTs = 0;
    let currentCycle = 1;
    let currentPhase: Phase = "inspiration";
    let lastTimeLeft = tempsInspiration;

    const tick = (ts: number) => {
      if (cycleStartTs === 0) cycleStartTs = ts;

      const elapsed = ts - cycleStartTs;
      const overallProgress = Math.min(elapsed / totalMs, 1);

      // Cercle : progresse de 0 % à 100 % sur tout le cycle, sans jamais se réinitialiser entre phases
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - overallProgress));
      }

      // Détermine la phase en cours et le countdown de la phase
      let newPhase: Phase;
      let phaseTimeLeft: number;
      let phaseProgress: number;

      if (elapsed < inspiMs) {
        newPhase = "inspiration";
        phaseTimeLeft = Math.max(1, Math.ceil((inspiMs - elapsed) / 1000));
        phaseProgress = elapsed / inspiMs;
      } else if (apneeMs > 0 && elapsed < inspiMs + apneeMs) {
        newPhase = "apnee";
        phaseTimeLeft = Math.max(1, Math.ceil((inspiMs + apneeMs - elapsed) / 1000));
        phaseProgress = (elapsed - inspiMs) / apneeMs;
      } else {
        newPhase = "expiration";
        phaseTimeLeft = Math.max(1, Math.ceil((totalMs - elapsed) / 1000));
        phaseProgress = Math.min((elapsed - inspiMs - apneeMs) / expiMs, 1);
      }

      // Bulle : scale basé sur la progression dans la phase courante
      if (bubbleRef.current) {
        const scale =
          newPhase === "inspiration" ? 1 + 0.15 * phaseProgress
          : newPhase === "expiration" ? 1.15 - 0.15 * phaseProgress
          : 1.15;
        bubbleRef.current.style.transform = `scale(${scale})`;
      }

      // Met à jour React seulement quand la valeur change (évite les re-renders inutiles)
      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        setPhase(newPhase);
      }
      if (phaseTimeLeft !== lastTimeLeft) {
        lastTimeLeft = phaseTimeLeft;
        setTimeLeft(phaseTimeLeft);
      }

      // Fin du cycle
      if (overallProgress >= 1) {
        if (currentCycle >= nombreCycles) {
          setFinished(true);
          return;
        }
        currentCycle++;
        currentPhase = "inspiration";
        lastTimeLeft = tempsInspiration;
        cycleStartTs = ts;
        setCycle(currentCycle);
        setPhase("inspiration");
        setTimeLeft(tempsInspiration);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [exerciseStarted, nombreCycles, inspiMs, apneeMs, expiMs, totalMs, tempsInspiration]);

  // ── Countdown ─────────────────────────────────────────────────────────────────
  if (!exerciseStarted) {
    return (
      <div className="card bg-white dark:bg-base-100 shadow-2xl border-2 border-primary">
        <div className="card-body items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary">{config.nom}</h2>
            <p className="text-gray-600 dark:text-base-content/70 mb-12">
              Préparez-vous... L&apos;exercice commence dans
            </p>
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}>
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle
                    cx="80" cy="80" r="70" fill="none"
                    stroke="#52a452" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(3 - countdown) / 3 * 440} 440`}
                    style={{ transition: "stroke-dasharray 1s ease-in" }}
                  />
                </svg>
                <div className="text-7xl font-bold animate-pulse" style={{ color: "#52a452" }}>{countdown}</div>
              </div>
            </div>
            <p className="text-gray-500 dark:text-base-content/60 mb-8">
              {countdown === 3 && "Installez-vous confortablement..."}
              {countdown === 2 && "Préparez votre respiration..."}
              {countdown === 1 && "C'est parti ! 🚀"}
            </p>
            <button onClick={onStop} className="btn btn-outline btn-sm gap-2">✕ Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Terminé ───────────────────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="card bg-white dark:bg-base-100 shadow-2xl border-2 border-primary">
        <div className="card-body items-center justify-center py-16 text-center">
          <div className="mb-4 text-6xl animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold mb-2 text-primary">Exercice terminé !</h2>
          <p className="text-gray-600 dark:text-base-content/70 mb-8">
            Vous avez complété {nombreCycles} cycle{nombreCycles > 1 ? "s" : ""} de cohérence cardiaque.
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <button onClick={onStop} className="btn btn-primary gap-2 order-2 sm:order-1">↻ Recommencer</button>
            <button onClick={onStop} className="btn btn-outline gap-2 order-1 sm:order-2">← Retour</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Exercice ──────────────────────────────────────────────────────────────────
  return (
    <div className="card bg-white dark:bg-base-100 shadow-2xl border-2 border-primary">
      <div className="card-body items-center py-12">
        <h2 className="text-2xl font-bold mb-2 text-primary">{config.nom}</h2>
        <div className="text-sm mb-8 opacity-70">
          Cycle <span className="font-semibold text-primary">{cycle}</span> / <span className="font-semibold">{nombreCycles}</span>
        </div>

        <div className="relative flex items-center justify-center mb-8">
          <svg width="280" height="280">
            <g transform="rotate(-90 140 140)">
              {/* Track gris de fond */}
              <circle cx="140" cy="140" r="120" fill="none" stroke="#e5e7eb" strokeWidth="10" opacity="0.3" />
              {/*
                Un seul cercle progressif — va de 0 % à 100 % sur la durée totale du cycle.
                La couleur change entre phases via React state (style.stroke).
                Le strokeDashoffset est piloté à 60 fps par le RAF via circleRef.
              */}
              <circle
                ref={circleRef}
                cx="140" cy="140" r="120"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                style={{ stroke: PHASE_COLORS[phase].border }}
              />
            </g>
          </svg>

          <div
            ref={bubbleRef}
            className="absolute flex flex-col items-center justify-center rounded-full border-8"
            style={{
              width: 160,
              height: 160,
              backgroundColor: PHASE_COLORS[phase].bg,
              borderColor: PHASE_COLORS[phase].border,
              transition: "background-color 0.3s, border-color 0.3s",
            }}
          >
            <span className="text-sm font-bold mb-1" style={{ color: PHASE_COLORS[phase].text }}>
              {PHASE_LABELS[phase]}
            </span>
            <span className="text-5xl font-bold" style={{ color: PHASE_COLORS[phase].text }}>{timeLeft}</span>
            <span className="text-xs font-semibold mt-1" style={{ color: PHASE_COLORS[phase].text }}>sec</span>
          </div>
        </div>

        <button onClick={onStop} className="btn btn-error gap-2">✕ Arrêter</button>
      </div>
    </div>
  );
}

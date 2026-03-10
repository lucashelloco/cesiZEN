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

export function ExerciceTimer({ config, onStop }: Props) {
  const { nombreCycles, tempsInspiration, tempsApnee, tempsExpiration } = config;

  const [cycle, setCycle] = useState(1);
  const [phase, setPhase] = useState<Phase>("inspiration");
  const [timeLeft, setTimeLeft] = useState(tempsInspiration);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [exerciseStarted, setExerciseStarted] = useState(false);

  const stateRef = useRef({ cycle, phase, timeLeft, paused, finished, exerciseStarted });
  stateRef.current = { cycle, phase, timeLeft, paused, finished, exerciseStarted };

  // Countdown avant de lancer l'exercice
  useEffect(() => {
    if (exerciseStarted) return;

    const countdownInterval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setExerciseStarted(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [exerciseStarted]);

  // Timer principal de l'exercice
  useEffect(() => {
    if (!exerciseStarted) return;

    const interval = setInterval(() => {
      const s = stateRef.current;
      if (s.paused || s.finished) return;

      if (s.timeLeft > 1) {
        setTimeLeft((t) => t - 1);
        return;
      }

      // Fin de la phase actuelle — passer à la suivante
      if (s.phase === "inspiration") {
        if (tempsApnee > 0) {
          setPhase("apnee");
          setTimeLeft(tempsApnee);
        } else {
          setPhase("expiration");
          setTimeLeft(tempsExpiration);
        }
      } else if (s.phase === "apnee") {
        setPhase("expiration");
        setTimeLeft(tempsExpiration);
      } else {
        // Fin expiration
        if (s.cycle >= nombreCycles) {
          setFinished(true);
        } else {
          setCycle((c) => c + 1);
          setPhase("inspiration");
          setTimeLeft(tempsInspiration);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exerciseStarted, nombreCycles, tempsInspiration, tempsApnee, tempsExpiration]);

  const phaseDuration =
    phase === "inspiration"
      ? tempsInspiration
      : phase === "apnee"
        ? tempsApnee
        : tempsExpiration;

  const progress = (phaseDuration - timeLeft) / phaseDuration;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const scale = phase === "inspiration" ? 1 + 0.15 * progress : phase === "expiration" ? 1.15 - 0.15 * progress : 1.15;

  // Phase de countdown
  if (!exerciseStarted) {
    return (
      <div className="card bg-white dark:bg-base-100 shadow-2xl border-2 border-primary">
        <div className="card-body items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary">{config.nom}</h2>
            <p className="text-gray-600 dark:text-base-content/70 mb-12">
              Préparez-vous... L&apos;exercice commence dans
            </p>

            {/* Cercle countdown */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#52a452"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(3 - countdown) / 3 * 440} 440`}
                    style={{ transition: "stroke-dasharray 1s ease-in" }}
                  />
                </svg>
                <div className="relative">
                  <div
                    className="text-7xl font-bold animate-pulse"
                    style={{ color: "#52a452" }}
                  >
                    {countdown}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 dark:text-base-content/60 mb-8">
              {countdown === 3 && "Installez-vous confortablement..."}
              {countdown === 2 && "Préparez votre respiration..."}
              {countdown === 1 && "C'est parti ! 🚀"}
            </p>

            <button
              onClick={onStop}
              className="btn btn-outline btn-sm gap-2"
            >
              ✕ Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <button onClick={onStop} className="btn btn-primary gap-2 order-2 sm:order-1">
              ↻ Recommencer
            </button>
            <button onClick={onStop} className="btn btn-outline gap-2 order-1 sm:order-2">
              ← Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-base-100 shadow-2xl border-2 border-primary">
      <div className="card-body items-center py-12">
        {/* Titre */}
        <h2 className="text-2xl font-bold mb-2 text-primary">{config.nom}</h2>

        {/* Progression */}
        <div className="text-sm mb-8 opacity-70">
          Cycle <span className="font-semibold text-primary">{cycle}</span> / <span className="font-semibold">{nombreCycles}</span>
        </div>

        {/* Cercle animé SVG */}
        <div className="relative flex items-center justify-center mb-8">
          <svg width="280" height="280" className="-rotate-90">
            {/* Cercle de base */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              opacity="0.3"
            />
            {/* Cercle progression */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke={PHASE_COLORS[phase].border}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>

          {/* Bulle centrale */}
          <div
            className="absolute flex flex-col items-center justify-center rounded-full border-8"
            style={{
              width: 160,
              height: 160,
              backgroundColor: PHASE_COLORS[phase].bg,
              borderColor: PHASE_COLORS[phase].border,
              transform: `scale(${scale})`,
              transition: "transform 1s linear, background-color 0.3s, border-color 0.3s",
            }}
          >
            <span
              className="text-6xl font-bold"
              style={{ color: PHASE_COLORS[phase].text }}
            >
              {timeLeft}
            </span>
            <span
              className="text-xs font-semibold mt-2"
              style={{ color: PHASE_COLORS[phase].text }}
            >
              sec
            </span>
          </div>
        </div>

        {/* Phase label */}
        <div
          className="text-3xl font-bold mb-8 transition-colors duration-300"
          style={{ color: PHASE_COLORS[phase].text }}
        >
          {PHASE_LABELS[phase]}
        </div>

        {/* Contrôles */}
        <div className="flex gap-4">
          <button
            onClick={() => setPaused((p) => !p)}
            className="btn btn-outline gap-2"
          >
            {paused ? "▶ Reprendre" : "⏸ Pause"}
          </button>
          <button
            onClick={onStop}
            className="btn btn-error gap-2"
          >
            ✕ Arrêter
          </button>
        </div>
      </div>
    </div>
  );
}

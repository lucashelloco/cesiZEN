"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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

const PHASE_COLORS: Record<Phase, string> = {
  inspiration: "#3b82f6",
  apnee: "#8b5cf6",
  expiration: "#10b981",
};

export function ExerciceTimer({ config, onStop }: Props) {
  const { nombreCycles, tempsInspiration, tempsApnee, tempsExpiration } = config;

  const [cycle, setCycle] = useState(1);
  const [phase, setPhase] = useState<Phase>("inspiration");
  const [timeLeft, setTimeLeft] = useState(tempsInspiration);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);

  const stateRef = useRef({ cycle, phase, timeLeft, paused, finished });
  stateRef.current = { cycle, phase, timeLeft, paused, finished };

  useEffect(() => {
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
  }, [nombreCycles, tempsInspiration, tempsApnee, tempsExpiration]);

  const phaseDuration =
    phase === "inspiration"
      ? tempsInspiration
      : phase === "apnee"
        ? tempsApnee
        : tempsExpiration;

  const progress = (phaseDuration - timeLeft) / phaseDuration;

  // Rayon du cercle SVG
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const scale = phase === "inspiration" ? 1 + 0.15 * progress : phase === "expiration" ? 1.15 - 0.15 * progress : 1.15;

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-lg border bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exercice terminé !</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Vous avez complété {nombreCycles} cycle{nombreCycles > 1 ? "s" : ""} de cohérence cardiaque.
        </p>
        <Button onClick={onStop}>Recommencer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Cycle {cycle} / {nombreCycles}
      </div>

      {/* Cercle animé */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={PHASE_COLORS[phase]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
          />
        </svg>

        {/* Bulle centrale */}
        <div
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{
            width: 140,
            height: 140,
            backgroundColor: PHASE_COLORS[phase] + "20",
            border: `3px solid ${PHASE_COLORS[phase]}`,
            transform: `scale(${scale})`,
            transition: "transform 1s linear, background-color 0.5s, border-color 0.5s",
          }}
        >
          <span className="text-3xl font-bold" style={{ color: PHASE_COLORS[phase] }}>
            {timeLeft}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">sec</span>
        </div>
      </div>

      {/* Phase label */}
      <div
        className="text-2xl font-semibold transition-colors duration-500"
        style={{ color: PHASE_COLORS[phase] }}
      >
        {PHASE_LABELS[phase]}
      </div>

      {/* Contrôles */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setPaused((p) => !p)}>
          {paused ? "Reprendre" : "Pause"}
        </Button>
        <Button variant="destructive" onClick={onStop}>
          Arrêter
        </Button>
      </div>
    </div>
  );
}

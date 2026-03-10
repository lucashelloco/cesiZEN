"use client";

import { useState } from "react";
import { ExerciceConfigurateur } from "./exercice-configurateur";
import { ExerciceTimer } from "./exercice-timer";

type Exercice = {
  id: string;
  nom: string;
  nombreCycles: number;
  tempsInspiration: number;
  tempsApnee: number;
  tempsExpiration: number;
};

type Config = {
  nom: string;
  nombreCycles: number;
  tempsInspiration: number;
  tempsApnee: number;
  tempsExpiration: number;
};

type Props = {
  presets: Exercice[];
  userConfig: Exercice | null;
  isAuthenticated: boolean;
};

export function ExerciceClient({ presets, userConfig, isAuthenticated }: Props) {
  const [activeConfig, setActiveConfig] = useState<Config | null>(null);

  if (activeConfig) {
    return (
      <ExerciceTimer
        config={activeConfig}
        onStop={() => setActiveConfig(null)}
      />
    );
  }

  return (
    <ExerciceConfigurateur
      presets={presets}
      userConfig={userConfig}
      isAuthenticated={isAuthenticated}
      onStart={(config) => setActiveConfig(config)}
    />
  );
}

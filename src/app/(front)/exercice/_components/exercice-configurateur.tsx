"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  onStart: (config: Config) => void;
};

export function ExerciceConfigurateur({ presets, userConfig, isAuthenticated, onStart }: Props) {
  const initial = userConfig ?? {
    nom: "Ma configuration",
    nombreCycles: 6,
    tempsInspiration: 5,
    tempsApnee: 0,
    tempsExpiration: 5,
  };

  const [nom, setNom] = useState(initial.nom);
  const [nombreCycles, setNombreCycles] = useState(initial.nombreCycles);
  const [tempsInspiration, setTempsInspiration] = useState(initial.tempsInspiration);
  const [tempsApnee, setTempsApnee] = useState(initial.tempsApnee);
  const [tempsExpiration, setTempsExpiration] = useState(initial.tempsExpiration);
  const [saved, setSaved] = useState(false);

  const saveConfig = api.exercices.saveUserConfig.useMutation({
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  function applyPreset(preset: Exercice) {
    setNom(preset.nom);
    setNombreCycles(preset.nombreCycles);
    setTempsInspiration(preset.tempsInspiration);
    setTempsApnee(preset.tempsApnee);
    setTempsExpiration(preset.tempsExpiration);
  }

  const totalSecondes = nombreCycles * (tempsInspiration + tempsApnee + tempsExpiration);
  const minutes = Math.floor(totalSecondes / 60);
  const secondes = totalSecondes % 60;

  return (
    <div className="space-y-6">
      {/* Presets */}
      {presets.length > 0 && (
        <div className="rounded-lg border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">Exercices proposés</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="rounded-lg border p-3 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-950"
              >
                <p className="font-medium text-gray-900 dark:text-white">{preset.nom}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {preset.tempsInspiration}s inspiration
                  {preset.tempsApnee > 0 ? ` · ${preset.tempsApnee}s apnée` : ""}
                  {` · ${preset.tempsExpiration}s expiration`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{preset.nombreCycles} cycles</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Configurateur */}
      <div className="rounded-lg border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Configuration personnalisée</h2>

        <div className="space-y-4">
          {isAuthenticated && (
            <div className="space-y-1">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="cycles">Cycles</Label>
              <Input
                id="cycles"
                type="number"
                min={1}
                max={30}
                value={nombreCycles}
                onChange={(e) => setNombreCycles(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="inspiration">Inspiration (s)</Label>
              <Input
                id="inspiration"
                type="number"
                min={1}
                max={30}
                value={tempsInspiration}
                onChange={(e) => setTempsInspiration(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="apnee">Apnée (s)</Label>
              <Input
                id="apnee"
                type="number"
                min={0}
                max={30}
                value={tempsApnee}
                onChange={(e) => setTempsApnee(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="expiration">Expiration (s)</Label>
              <Input
                id="expiration"
                type="number"
                min={1}
                max={30}
                value={tempsExpiration}
                onChange={(e) => setTempsExpiration(Number(e.target.value))}
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Durée totale : {minutes > 0 ? `${minutes} min ` : ""}{secondes > 0 ? `${secondes} s` : ""}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            onClick={() => onStart({ nom, nombreCycles, tempsInspiration, tempsApnee, tempsExpiration })}
            className="flex-1"
          >
            Lancer l&apos;exercice
          </Button>
          {isAuthenticated && (
            <Button
              variant="outline"
              disabled={saveConfig.isPending}
              onClick={() => saveConfig.mutate({ nom, nombreCycles, tempsInspiration, tempsApnee, tempsExpiration })}
            >
              {saved ? "Sauvegardé ✓" : "Sauvegarder"}
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
            Connectez-vous pour sauvegarder votre configuration.
          </p>
        )}
      </div>
    </div>
  );
}

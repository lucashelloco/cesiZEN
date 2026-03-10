import { getSession } from "@/server/better-auth/server";
import { api } from "@/trpc/server";
import { ExerciceClient } from "./_components/exercice-client";

export default async function ExercicePage() {
  const session = await getSession();
  const presets = await api.exercices.getPresets();

  const userConfig = session
    ? await api.exercices.getUserConfig()
    : null;

  return (
    <div className="mx-auto max-w-2xl xl:max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--brand-green)" }}>
        Exercice de cohérence cardiaque
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        La cohérence cardiaque synchronise votre respiration et votre rythme cardiaque pour réduire le stress.
      </p>

      <ExerciceClient
        presets={presets}
        userConfig={userConfig}
        isAuthenticated={!!session}
      />
    </div>
  );
}

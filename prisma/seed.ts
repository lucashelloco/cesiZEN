import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Les 3 exercices de cohérence cardiaque proposés par défaut
  const presets = [
    {
      nom: "7-4-8",
      nombreCycles: 10,
      tempsInspiration: 7,
      tempsApnee: 4,
      tempsExpiration: 8,
      isPreset: true,
    },
    {
      nom: "5-0-5",
      nombreCycles: 10,
      tempsInspiration: 5,
      tempsApnee: 0,
      tempsExpiration: 5,
      isPreset: true,
    },
    {
      nom: "4-0-6",
      nombreCycles: 10,
      tempsInspiration: 4,
      tempsApnee: 0,
      tempsExpiration: 6,
      isPreset: true,
    },
  ];

  for (const preset of presets) {
    await prisma.exerciceCardiaque.upsert({
      where: {
        // On identifie chaque preset par son nom pour éviter les doublons
        nom_isPreset: { nom: preset.nom, isPreset: true },
      },
      update: preset,
      create: preset,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

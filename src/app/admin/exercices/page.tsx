import { api } from "@/trpc/server";
import { ExercicesTable } from "./_components/exercices-table";
import { ExerciceForm } from "./_components/exercice-form";

export default async function AdminExercicesPage() {
  const exercices = await api.adminExercices.listPresets();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--brand-green)" }}>Exercices presets</h1>
        <ExerciceForm />
      </div>
      <ExercicesTable exercices={exercices} />
    </div>
  );
}

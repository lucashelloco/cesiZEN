import { api } from "@/trpc/server";
import { ContenusTable } from "./_components/contenus-table";
import { ContenuForm } from "./_components/contenu-form";

export default async function AdminContenusPage() {
  const contenus = await api.adminContenus.list();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--brand-green)" }}>Contenus</h1>
        <ContenuForm />
      </div>
      <ContenusTable contenus={contenus} />
    </div>
  );
}

import { api } from "@/trpc/server";
import { ContenusProvider } from "./_components/contenus-context";
import { ContenusClient } from "./_components/contenus-client";

export default async function ContenusPage() {
  // Contrôleur 1 (SSR) : charge les 90 premiers contenus triés par date récente
  const result = await api.contenus.list({ offset: 0, limit: 90, sortBy: "date-desc" });

  return (
    <ContenusProvider initialContenus={result.contenus} initialTotal={result.total}>
      <ContenusClient />
    </ContenusProvider>
  );
}
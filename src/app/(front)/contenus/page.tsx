import { api } from "@/trpc/server";
import { ContenusClient } from "./_components/contenus-client";

export default async function ContenusPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  // Récupérer les paramètres avec des valeurs par défaut
  const search = params.search;
  const page = params.page ? parseInt(params.page) : 1;
  const sortBy = (params.sortBy === "date-asc" || params.sortBy === "date-desc")
    ? params.sortBy
    : "date-desc";

  const result = await api.contenus.list({
    search,
    page,
    limit: 12,
    sortBy,
  });

  return <ContenusClient initialContenus={result.contenus} initialPagination={result.pagination} />;
}

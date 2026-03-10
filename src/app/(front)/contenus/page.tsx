import Link from "next/link";
import { api } from "@/trpc/server";
import { Badge } from "@/components/ui/badge";

export default async function ContenusPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filtreType =
    type === "ARTICLE" || type === "DOCUMENT" ? type : undefined;

  const contenus = await api.contenus.list({ type: filtreType });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--brand-green)" }}>Contenus santé</h1>
        <div className="flex gap-2">
          <Link
            href="/contenus"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${!filtreType ? "text-white" : "border text-gray-600 hover:bg-white/60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/60"}`}
            style={!filtreType ? { backgroundColor: "var(--brand-green)" } : {}}
          >
            Tous
          </Link>
          <Link
            href="/contenus?type=ARTICLE"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filtreType === "ARTICLE" ? "text-white" : "border text-gray-600 hover:bg-white/60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/60"}`}
            style={filtreType === "ARTICLE" ? { backgroundColor: "var(--brand-green)" } : {}}
          >
            Articles
          </Link>
          <Link
            href="/contenus?type=DOCUMENT"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filtreType === "DOCUMENT" ? "text-white" : "border text-gray-600 hover:bg-white/60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/60"}`}
            style={filtreType === "DOCUMENT" ? { backgroundColor: "var(--brand-green)" } : {}}
          >
            Documents
          </Link>
        </div>
      </div>

      {contenus.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">Aucun contenu disponible.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contenus.map((contenu) => (
            <Link
              key={contenu.id}
              href={`/contenus/${contenu.id}`}
              className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="outline">{contenu.type}</Badge>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(contenu.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{contenu.titre}</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Par {contenu.auteur.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

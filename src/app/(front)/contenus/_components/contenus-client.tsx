"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useContenus } from "./contenus-context";

export function ContenusClient() {
  const {
    displayedItems,
    total,
    batchOffset,
    displayPage,
    totalDisplayPages,
    hasNextBatch,
    hasPrevBatch,
    sortBy,
    searchInput,
    isLoading,
    loadBatch,
    search,
    sort,
    goToDisplayPage,
    loadInitial,
  } = useContenus();

  const BATCH_SIZE = 90;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--brand-green)" }}>
          Contenus santé
        </h1>
      </div>

      {/* Barre de recherche et tri */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans les contenus..."
              value={searchInput}
              onChange={(e) => search(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-base-100 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isLoading && (
              <span className="absolute right-3 top-2.5 loading loading-spinner loading-xs text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-base-100 border border-gray-300 dark:border-gray-700 rounded-full p-1">
          <button
            onClick={() => sort("date-desc")}
            className={`btn btn-ghost btn-sm rounded-full gap-1 ${sortBy === "date-desc" ? "bg-primary text-white" : ""}`}
            title="Plus récent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          <button
            onClick={() => sort("date-asc")}
            className={`btn btn-ghost btn-sm rounded-full gap-1 ${sortBy === "date-asc" ? "bg-primary text-white" : ""}`}
            title="Plus ancien"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Résultats */}
      {displayedItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchInput ? "Aucun contenu trouvé pour cette recherche." : "Aucun contenu disponible."}
          </p>
          {searchInput && (
            <button onClick={loadInitial} className="btn btn-ghost btn-sm rounded-full">
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {total} résultat{total > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedItems.map((contenu) => (
              <Link
                key={contenu.id}
                href={`/contenus/${contenu.id}`}
                className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-base-100"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {contenu.type === "ARTICLE" && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {contenu.type === "DOCUMENT" && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    {contenu.type}
                  </Badge>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(contenu.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{contenu.titre}</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Par {contenu.auteur.name}</p>
              </Link>
            ))}
          </div>

          {/* Pagination d'affichage (dans le lot de 90) */}
          {totalDisplayPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {displayPage > 1 && (
                <button
                  onClick={() => goToDisplayPage(displayPage - 1)}
                  className="btn btn-ghost btn-sm rounded-full"
                >
                  ← Précédent
                </button>
              )}

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalDisplayPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalDisplayPages - 4, displayPage - 2)) + i;
                  if (pageNum > totalDisplayPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToDisplayPage(pageNum)}
                      className={`btn btn-sm rounded-full ${pageNum === displayPage ? "btn-primary" : "btn-ghost"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {displayPage < totalDisplayPages && (
                <button
                  onClick={() => goToDisplayPage(displayPage + 1)}
                  className="btn btn-ghost btn-sm rounded-full"
                >
                  Suivant →
                </button>
              )}
            </div>
          )}

          {/* Navigation entre lots de 90 */}
          {(hasPrevBatch || hasNextBatch) && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => loadBatch(batchOffset - BATCH_SIZE)}
                disabled={!hasPrevBatch}
                className="btn btn-ghost btn-sm rounded-full text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15"
              >
                ← Lot précédent
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Lot {Math.floor(batchOffset / BATCH_SIZE) + 1} / {Math.ceil(total / BATCH_SIZE)}
              </span>
              <button
                onClick={() => loadBatch(batchOffset + BATCH_SIZE)}
                disabled={!hasNextBatch}
                className="btn btn-ghost btn-sm rounded-full text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15"
              >
                Lot suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

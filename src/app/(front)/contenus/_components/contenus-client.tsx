"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";

type Contenu = {
  id: string;
  titre: string;
  type: "ARTICLE" | "DOCUMENT";
  createdAt: Date;
  auteur: { name: string };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type Props = {
  initialContenus: Contenu[];
  initialPagination: Pagination;
};

export function ContenusClient({ initialContenus, initialPagination }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [queryKey, setQueryKey] = useState(0);

  const { data } = api.contenus.list.useQuery(
    { search: search || undefined, page: currentPage, limit: 12, sortBy },
    { enabled: queryKey > 0 }
  );

  const contenus = data?.contenus ?? initialContenus;
  const pagination = data?.pagination ?? initialPagination;

  const handleSearch = () => {
    setCurrentPage(1);
    setQueryKey(prev => prev + 1);
  };

  const handleSortChange = (newSortBy: "date-asc" | "date-desc") => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    setQueryKey(prev => prev + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQueryKey(prev => prev + 1);
  };

  return (
    <div>
      {/* Header avec titre */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            disabled={false}
            className="btn btn-primary btn-sm gap-2 rounded-full"
          >
            {false ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            Rechercher
          </button>

          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-1">
            <button
              onClick={() => handleSortChange("date-desc")}
              className={`btn btn-ghost btn-sm rounded-full gap-1 ${sortBy === "date-desc" ? "bg-primary text-white" : ""}`}
              title="Plus récent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <button
              onClick={() => handleSortChange("date-asc")}
              className={`btn btn-ghost btn-sm rounded-full gap-1 ${sortBy === "date-asc" ? "bg-primary text-white" : ""}`}
              title="Plus ancien"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {contenus.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? "Aucun contenu trouvé pour cette recherche." : "Aucun contenu disponible."}
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
                setQueryKey(prev => prev + 1);
              }}
              className="btn btn-ghost btn-sm rounded-full"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {pagination.total} résultat{pagination.total > 1 ? "s" : ""} trouvé{pagination.total > 1 ? "s" : ""}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contenus.map((contenu) => (
              <Link
                key={contenu.id}
                href={`/contenus/${contenu.id}`}
                className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {contenu.type === "ARTICLE" && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {contenu.type === "DOCUMENT" && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-ghost btn-sm rounded-full"
              >
                ← Précédent
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn btn-sm rounded-full ${pageNum === pagination.page ? "btn-primary" : "btn-ghost"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="btn btn-ghost btn-sm rounded-full"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
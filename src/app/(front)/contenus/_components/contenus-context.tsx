"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { api } from "@/trpc/react";

export type Contenu = {
  id: string;
  titre: string;
  type: "ARTICLE" | "DOCUMENT";
  createdAt: Date;
  auteur: { name: string };
};

const BATCH_SIZE = 90;
const PAGE_SIZE = 9;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Cache localStorage ──────────────────────────────────────────────────────

function cacheKey(search: string, offset: number, sortBy: string) {
  return `cz_contenus_${search}_${offset}_${sortBy}`;
}

function readCache(key: string): { contenus: Contenu[]; total: number } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { contenus: Contenu[]; total: number; ts: number };
    if (Date.now() - entry.ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
    return entry;
  } catch { return null; }
}

function writeCache(key: string, contenus: Contenu[], total: number) {
  try { localStorage.setItem(key, JSON.stringify({ contenus, total, ts: Date.now() })); } catch {}
}

// ─── Context type ─────────────────────────────────────────────────────────────

type ContenusContextType = {
  displayedItems: Contenu[];
  total: number;
  batchOffset: number;
  displayPage: number;
  totalDisplayPages: number;
  hasNextBatch: boolean;
  hasPrevBatch: boolean;
  sortBy: "date-asc" | "date-desc";
  searchInput: string;
  isLoading: boolean;
  // Contrôleur 1 : charge les 90 premiers (date desc), réinitialise
  loadInitial: () => void;
  // Contrôleur 2 : charge le lot suivant/précédent (offset)
  loadBatch: (offset: number) => void;
  // Contrôleur 3 : recherche avec debounce
  search: (query: string) => void;
  // Contrôleur 4 : tri par date
  sort: (sortBy: "date-asc" | "date-desc") => void;
  // Navigation d'affichage interne au lot
  goToDisplayPage: (page: number) => void;
};

const ContenusContext = createContext<ContenusContextType | null>(null);

export function useContenus() {
  const ctx = useContext(ContenusContext);
  if (!ctx) throw new Error("useContenus doit être utilisé dans ContenusProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ContenusProvider({
  children,
  initialContenus,
  initialTotal,
}: {
  children: ReactNode;
  initialContenus: Contenu[];
  initialTotal: number;
}) {
  const [items, setItems] = useState<Contenu[]>(initialContenus);
  const [total, setTotal] = useState(initialTotal);
  const [batchOffset, setBatchOffset] = useState(0);
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-desc");
  const [searchQuery, setSearchQuery] = useState(""); // valeur debounced envoyée à l'API
  const [searchInput, setSearchInput] = useState(""); // valeur brute de l'input
  const [displayPage, setDisplayPage] = useState(1);
  const [queryEnabled, setQueryEnabled] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Requête unique réactive à tous les paramètres ──
  const { data: apiData, isFetching } = api.contenus.list.useQuery(
    { search: searchQuery || undefined, offset: batchOffset, limit: BATCH_SIZE, sortBy },
    { enabled: queryEnabled, staleTime: CACHE_TTL }
  );

  // ── Mise à jour de l'état et du cache quand l'API répond ──
  useEffect(() => {
    if (!apiData) return;
    setItems(apiData.contenus);
    setTotal(apiData.total);
    setDisplayPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  // Écriture cache séparée (les params sont cohérents avec la réponse)
  useEffect(() => {
    if (!apiData) return;
    writeCache(cacheKey(searchQuery, batchOffset, sortBy), apiData.contenus, apiData.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  // ── Fonction interne : lit le cache puis active la requête ──
  const trigger = (search: string, offset: number, sort: "date-asc" | "date-desc") => {
    const cached = readCache(cacheKey(search, offset, sort));
    if (cached) {
      setItems(cached.contenus);
      setTotal(cached.total);
      setDisplayPage(1);
    }
    setQueryEnabled(true);
  };

  // ── Contrôleur 1 : réinitialisation (données SSR, pas d'appel API) ──
  const loadInitial = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setItems(initialContenus);
    setTotal(initialTotal);
    setBatchOffset(0);
    setSortBy("date-desc");
    setSearchQuery("");
    setSearchInput("");
    setDisplayPage(1);
    setQueryEnabled(false);
  };

  // ── Contrôleur 2 : lot suivant / précédent (offset de 90) ──
  const loadBatch = (offset: number) => {
    setBatchOffset(offset);
    trigger(searchQuery, offset, sortBy);
  };

  // ── Contrôleur 3 : recherche avec debounce 500ms ──
  const search = (query: string) => {
    setSearchInput(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(query);
      setBatchOffset(0);
      trigger(query, 0, sortBy);
    }, 500);
  };

  // ── Contrôleur 4 : tri par date ──
  const sort = (newSortBy: "date-asc" | "date-desc") => {
    setSortBy(newSortBy);
    setBatchOffset(0);
    trigger(searchQuery, 0, newSortBy);
  };

  const displayedItems = items.slice((displayPage - 1) * PAGE_SIZE, displayPage * PAGE_SIZE);
  const totalDisplayPages = Math.ceil(items.length / PAGE_SIZE);
  const hasNextBatch = batchOffset + BATCH_SIZE < total;
  const hasPrevBatch = batchOffset > 0;

  return (
    <ContenusContext.Provider value={{
      displayedItems,
      total,
      batchOffset,
      displayPage,
      totalDisplayPages,
      hasNextBatch,
      hasPrevBatch,
      sortBy,
      searchInput,
      isLoading: isFetching,
      loadInitial,
      loadBatch,
      search,
      sort,
      goToDisplayPage: setDisplayPage,
    }}>
      {children}
    </ContenusContext.Provider>
  );
}

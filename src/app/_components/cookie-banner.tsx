"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-4 py-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Ce site utilise des cookies strictement nécessaires à son fonctionnement (session d&apos;authentification).
          Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé.{" "}
          <Link href="/politique-de-confidentialite#cookies" className="underline hover:text-gray-900 dark:hover:text-white">
            En savoir plus
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={refuse}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

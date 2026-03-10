"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

type Props = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName?: string;
};

export function MobileMenu({ isAuthenticated, isAdmin, userName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col gap-1.5 p-2"
        aria-label="Menu"
      >
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all dark:bg-gray-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all dark:bg-gray-300 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all dark:bg-gray-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b bg-white shadow-md dark:border-gray-800 dark:bg-gray-900">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <Link href="/contenus" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">Contenus</Link>
            <Link href="/exercice" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">Exercice</Link>

            <div className="my-2 border-t dark:border-gray-700" />

            {isAuthenticated ? (
              <>
                <Link href="/profil" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userName}
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-primary">
                    Back Office Admin
                  </Link>
                )}
                <div className="py-1">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Connexion</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-primary">Inscription</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { SignOutButton } from "./sign-out-button";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

export async function Header() {
  const session = await getSession();

  const isAdmin = session?.user
    ? (await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }))?.role === "ADMIN"
    : false;

  return (
    <header className="relative border-b bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.jpg" alt="CesiZen" width={40} height={40} className="rounded" />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/contenus" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-white">
            Contenus
          </Link>
          <Link href="/exercice" className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-white">
            Exercice
          </Link>
        </nav>

        {/* Actions desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/profil" className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-white">
                Profil
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--brand-green)" }}
                >
                  Admin
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: "var(--brand-green)" }}
              >
                Inscription
              </Link>
            </div>
          )}
        </div>

        {/* Menu mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileMenu
            isAuthenticated={!!session}
            isAdmin={!!isAdmin}
            userName={session?.user.name}
          />
        </div>
      </div>
    </header>
  );
}

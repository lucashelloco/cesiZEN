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
    <header className="navbar bg-white dark:bg-base-100 shadow-sm border-b border-gray-200 dark:border-base-300">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost hover:bg-primary/5 border-transparent dark:hover:bg-primary/15 dark:hover:border-transparent" >
          <Image src="/logo.png" alt="CesiZen" width={35} height={35} className="rounded" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex gap-1">
        <Link href="/contenus" className="btn btn-ghost text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15">
          Contenus
        </Link>
        <Link href="/exercice" className="btn btn-ghost text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15">
          Exercice
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <ThemeToggle />
        {session ? (
          <>
            <Link href="/profil" className="btn btn-ghost text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15">
              Profil
            </Link>
            {isAdmin && (
              <Link href="/admin" className="btn btn-primary btn-sm">
                Admin
              </Link>
            )}
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15">
              Connexion
            </Link>
            <Link href="/register" className="btn btn-primary">
              Inscription
            </Link>
          </>
        )}
        <div className="lg:hidden">
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

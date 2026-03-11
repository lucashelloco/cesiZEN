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
        <Link href="/" className="btn btn-ghost hover:bg-white border-transparent hover:border-gray-200 dark:hover:bg-white/10 dark:hover:border-transparent" >
          <Image src="/logo.png" alt="CesiZen" width={35} height={35} className="rounded" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-gray-700 dark:text-base-content">
          <li>
            <Link href="/contenus" className="hover:text-primary">
              Contenus
            </Link>
          </li>
          <li>
            <Link href="/exercice" className="hover:text-primary">
              Exercice
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <ThemeToggle />
        {session ? (
          <>
            <Link href="/profil" className="btn btn-ghost text-gray-700 dark:text-base-content">
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
            <Link href="/login" className="btn btn-ghost text-gray-700 dark:text-base-content">
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

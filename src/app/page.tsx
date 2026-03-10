import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role === "ADMIN") redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <Image src="/logo.jpg" alt="CesiZen" width={160} height={160} className="mb-4 rounded-xl" priority />
        <p className="text-base text-gray-500 dark:text-gray-400 sm:text-lg">L&apos;application de votre santé mentale</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/exercice"
            className="rounded-lg px-6 py-3 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            Lancer un exercice
          </Link>
          <Link
            href="/contenus"
            className="rounded-lg border-2 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: "var(--brand-yellow)", color: "var(--brand-green)" }}
          >
            Découvrir les contenus
          </Link>
          {!session && (
            <Link
              href="/register"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Créer un compte
            </Link>
          )}
        </div>

        {session && (
          <p className="mt-8 text-gray-600 dark:text-gray-300">
            Bonjour, <span className="font-semibold">{session.user.name}</span> !
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

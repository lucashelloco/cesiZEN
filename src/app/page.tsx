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

  // Fetch real stats
  const userCount = await db.user.count();
  const exerciceCount = await db.exerciceCardiaque.count({ where: { isPreset: true } });
  const contenuCount = await db.contenu.count({ where: { isPublished: true } });

  return (
    <div className="flex min-h-screen flex-col" suppressHydrationWarning>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-base-100 to-accent/10 pt-20 pb-32 sm:pt-32 sm:pb-40">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-5xl px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Contenu texte */}
              <div className="space-y-8">
                <div className="space-y-4 animate-fade-in-up">
                  <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    Prenez soin de votre <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">santé mentale</span>
                  </h1>
                  <p className="text-lg text-base-content/70 sm:text-xl">
                    CesiZen vous aide à gérer le stress, l&apos;anxiété et à trouver l&apos;équilibre émotionnel à travers des exercices guidés et des contenus inspirants.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up delay-200">
                  {!session ? (
                    <>
                      <Link href="/register" className="btn btn-primary btn-lg">
                        Commencer maintenant
                      </Link>
                      <Link href="/login" className="btn btn-outline btn-lg">
                        Se connecter
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/exercice" className="btn btn-primary btn-lg">
                        Lancer un exercice
                      </Link>
                      <Link href="/contenus" className="btn btn-outline btn-lg">
                        Découvrir les contenus
                      </Link>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 border-t border-base-300 pt-8 animate-fade-in-up delay-300 dark:border-base-content/10">
                  <div>
                    <p className="text-2xl font-bold text-primary">{userCount.toLocaleString('fr-FR')}</p>
                    <p className="text-sm text-base-content/60">Utilisateurs actifs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{exerciceCount.toLocaleString('fr-FR')}</p>
                    <p className="text-sm text-base-content/60">Exercices disponibles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">24/7</p>
                    <p className="text-sm text-base-content/60">Disponibilité</p>
                  </div>
                </div>

                {session && (
                  <div className="rounded-lg bg-base-100 p-4 shadow animate-fade-in-up delay-300">
                    <p className="text-sm font-medium">
                      Bienvenue, <span className="text-primary font-bold">{session.user.name}</span> ! 👋
                    </p>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="flex justify-center animate-float">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl"></div>
                  <Image
                    src="/logo.jpg"
                    alt="CesiZen"
                    width={280}
                    height={280}
                    className="relative rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-base-100 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">
                Pourquoi choisir <span className="text-primary">CesiZen</span> ?
              </h2>
              <p className="text-lg text-gray-600 dark:text-base-content/70">Des outils modernes pour votre bien-être mental</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-md hover:shadow-xl border-2 border-primary transition-all duration-300 animate-fade-in-up delay-100">
                <div className="card-body">
                  <div className="text-4xl mb-4">🧘</div>
                  <h3 className="card-title text-lg text-primary">Exercices guidés</h3>
                  <p className="text-gray-700 dark:text-base-content/70">Découvrez des exercices de respiration, méditation et cohérence cardiaque.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card bg-gradient-to-br from-accent/10 to-transparent shadow-md hover:shadow-xl border-2 border-accent transition-all duration-300 animate-fade-in-up delay-200">
                <div className="card-body">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="card-title text-lg text-accent">Contenus riches</h3>
                  <p className="text-gray-700 dark:text-base-content/70">Articles et ressources pour mieux comprendre votre santé mentale.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card bg-gradient-to-br from-secondary/10 to-transparent shadow-md hover:shadow-xl border-2 border-secondary transition-all duration-300 animate-fade-in-up delay-300">
                <div className="card-body">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="card-title text-lg text-secondary">Suivi personnel</h3>
                  <p className="text-gray-700 dark:text-base-content/70">Suivez votre progression et vos statistiques de bien-être.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!session && (
          <div className="bg-gradient-to-r from-primary to-accent py-20 sm:py-28 text-white">
            <div className="mx-auto max-w-3xl px-4 text-center">
              <h2 className="text-3xl font-bold mb-4 sm:text-4xl">Prêt à changer votre vie ?</h2>
              <p className="text-lg mb-8 text-white/90">Rejoignez des milliers de personnes qui ont déjà trouvé leur équilibre.</p>
              <Link href="/register" className="btn btn-light btn-lg">
                S&apos;inscrire gratuitement
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/server/better-auth/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setError(error.message ?? "Une erreur est survenue");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-base-100 p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.png" alt="CesiZen" width={52} height={52} className="rounded-xl mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-base-content/60">
            Commencez votre voyage vers le bien-être
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-base-300 bg-white dark:bg-base-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-base-content" htmlFor="name">
                Prénom et nom
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                className="w-full rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-100 px-4 py-2.5 text-sm text-gray-900 dark:text-base-content placeholder:text-gray-400 dark:placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-base-content" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-100 px-4 py-2.5 text-sm text-gray-900 dark:text-base-content placeholder:text-gray-400 dark:placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-base-content" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-100 px-4 py-2.5 text-sm text-gray-900 dark:text-base-content placeholder:text-gray-400 dark:placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <p className="text-xs text-gray-400 dark:text-base-content/40">Minimum 8 caractères</p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-base-content/60">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-base-content/40">
          En vous inscrivant, vous acceptez nos{" "}
          <Link href="#" className="hover:underline">conditions d&apos;utilisation</Link>
          {" "}et notre{" "}
          <Link href="#" className="hover:underline">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

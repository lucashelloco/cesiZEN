"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/server/better-auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setError(error.message ?? "Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGithubSignIn() {
    await authClient.signIn.social({ provider: "github", callbackURL: "/" });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-base-content/60">
            Connectez-vous à votre compte CesiZen
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-base-300 bg-white dark:bg-base-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-base-content" htmlFor="password">
                  Mot de passe
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 dark:border-base-300 bg-white dark:bg-base-100 px-4 py-2.5 text-sm text-gray-900 dark:text-base-content placeholder:text-gray-400 dark:placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="divider my-5 text-xs text-gray-400 dark:text-base-content/40">ou</div>

          <button
            onClick={handleGithubSignIn}
            className="btn btn-ghost w-full text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continuer avec GitHub
          </button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-base-content/60">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-base-content/40">
          En vous connectant, vous acceptez nos{" "}
          <Link href="#" className="hover:underline">conditions d&apos;utilisation</Link>
          {" "}et notre{" "}
          <Link href="#" className="hover:underline">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

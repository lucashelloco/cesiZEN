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

  async function handleSubmit(e: React.FormEvent) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-20 blur-lg"></div>
              <Image
                src="/logo.jpg"
                alt="CesiZen"
                width={60}
                height={60}
                className="relative rounded-xl"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Bienvenue</h1>
          <p className="text-base-content/60">Connectez-vous à votre compte CesiZen</p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="input input-bordered input-lg w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Mot de passe</span>
                  <Link href="#" className="label-text-alt link link-hover">
                    Oublié ?
                  </Link>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered input-lg w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="divider my-2">ou</div>

            <button
              onClick={handleGithubSignIn}
              className="btn btn-outline btn-lg w-full"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>

            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Pas encore de compte ?{" "}
                <Link href="/register" className="link link-primary font-semibold">
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-base-content/50 mt-6">
          En vous connectant, vous acceptez nos <Link href="#" className="link link-hover">conditions d&apos;utilisation</Link> et notre <Link href="#" className="link link-hover">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

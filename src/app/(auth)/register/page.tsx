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

  async function handleSubmit(e: React.FormEvent) {
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
          <h1 className="text-3xl font-bold mb-2">Rejoignez CesiZen</h1>
          <p className="text-base-content/60">Commencez votre voyage vers le bien-être</p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Prénom et nom</span>
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="input input-bordered input-lg w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered input-lg w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <p className="text-xs text-base-content/60 mt-1">Minimum 8 caractères</p>
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
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            <div className="divider my-4">ou</div>

            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Déjà un compte ?{" "}
                <Link href="/login" className="link link-primary font-semibold">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-base-content/50 mt-6">
          En vous inscrivant, vous acceptez nos <Link href="#" className="link link-hover">conditions d&apos;utilisation</Link> et notre <Link href="#" className="link link-hover">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

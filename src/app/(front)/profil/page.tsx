import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { api } from "@/trpc/server";
import { ProfilForm } from "./_components/profil-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { DeleteAccountButton } from "./_components/delete-account-button";

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await api.profil.get();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold" style={{ color: "var(--brand-green)" }}>Mon profil</h1>

      <div className="space-y-6">
        <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-base-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h2>
          <ProfilForm user={user} />
        </div>

        <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-base-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h2>
          <ChangePasswordForm />
        </div>

        <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-base-100">
          <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Informations du compte</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Membre depuis le{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-base-100">
          <h2 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">Zone de danger</h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées (conformité RGPD).
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}

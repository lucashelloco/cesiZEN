"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);

  const deleteAccount = api.profil.deleteAccount.useMutation({
    onSuccess: async () => {
      await authClient.signOut();
      window.location.href = "/";
    },
  });

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        Supprimer mon compte
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-red-700">
        Êtes-vous sûr ? Cette action est irréversible.
      </p>
      <div className="flex gap-3">
        <Button
          variant="destructive"
          disabled={deleteAccount.isPending}
          onClick={() => deleteAccount.mutate()}
        >
          {deleteAccount.isPending ? "Suppression..." : "Confirmer la suppression"}
        </Button>
        <Button variant="outline" onClick={() => setConfirming(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

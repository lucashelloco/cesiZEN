"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = { id: string; name: string; email: string };

export function ProfilForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [success, setSuccess] = useState(false);

  const update = api.profil.update.useMutation({
    onSuccess: () => {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    update.mutate({ name, email });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {update.error && (
        <p role="alert" className="text-sm text-red-500">{update.error.message}</p>
      )}
      {success && (
        <p role="status" className="text-sm text-green-600">Profil mis à jour avec succès.</p>
      )}

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}

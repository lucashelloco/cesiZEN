"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Exercice = {
  id: string;
  nom: string;
  nombreCycles: number;
  tempsInspiration: number;
  tempsApnee: number;
  tempsExpiration: number;
};

export function ExerciceForm({ exercice }: { exercice?: Exercice }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(exercice?.nom ?? "");
  const [nombreCycles, setNombreCycles] = useState(exercice?.nombreCycles ?? 4);
  const [tempsInspiration, setTempsInspiration] = useState(exercice?.tempsInspiration ?? 4);
  const [tempsApnee, setTempsApnee] = useState(exercice?.tempsApnee ?? 0);
  const [tempsExpiration, setTempsExpiration] = useState(exercice?.tempsExpiration ?? 4);

  const create = api.adminExercices.create.useMutation({
    onSuccess: () => { setOpen(false); resetForm(); router.refresh(); },
  });

  const update = api.adminExercices.update.useMutation({
    onSuccess: () => { setOpen(false); router.refresh(); },
  });

  function resetForm() {
    setNom(""); setNombreCycles(4); setTempsInspiration(4); setTempsApnee(0); setTempsExpiration(4);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { nom, nombreCycles, tempsInspiration, tempsApnee, tempsExpiration };
    if (exercice) {
      update.mutate({ id: exercice.id, ...data });
    } else {
      create.mutate(data);
    }
  }

  const isPending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        {exercice ? "Modifier" : "Nouvel exercice"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercice ? "Modifier l'exercice" : "Créer un exercice preset"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Cohérence cardiaque" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycles">Nombre de cycles</Label>
              <Input id="cycles" type="number" min={1} value={nombreCycles} onChange={(e) => setNombreCycles(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspiration">Inspiration (s)</Label>
              <Input id="inspiration" type="number" min={1} value={tempsInspiration} onChange={(e) => setTempsInspiration(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apnee">Apnée (s)</Label>
              <Input id="apnee" type="number" min={0} value={tempsApnee} onChange={(e) => setTempsApnee(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration">Expiration (s)</Label>
              <Input id="expiration" type="number" min={1} value={tempsExpiration} onChange={(e) => setTempsExpiration(Number(e.target.value))} required />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

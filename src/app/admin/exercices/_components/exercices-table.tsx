"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useAnnounce } from "@/components/announcer-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExerciceForm } from "./exercice-form";

type Exercice = {
  id: string;
  nom: string;
  nombreCycles: number;
  tempsInspiration: number;
  tempsApnee: number;
  tempsExpiration: number;
  createdAt: Date;
};

export function ExercicesTable({ exercices }: { exercices: Exercice[] }) {
  const router = useRouter();
  const announce = useAnnounce();

  const deleteExercice = api.adminExercices.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      announce("Exercice supprimé");
    },
  });

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden sm:table-cell">Cycles</TableHead>
            <TableHead className="hidden sm:table-cell">Inspiration</TableHead>
            <TableHead className="hidden md:table-cell">Apnée</TableHead>
            <TableHead className="hidden md:table-cell">Expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                Aucun exercice preset
              </TableCell>
            </TableRow>
          )}
          {exercices.map((exercice) => (
            <TableRow key={exercice.id}>
              <TableCell className="font-medium">{exercice.nom}</TableCell>
              <TableCell className="hidden sm:table-cell">{exercice.nombreCycles}</TableCell>
              <TableCell className="hidden sm:table-cell">{exercice.tempsInspiration}s</TableCell>
              <TableCell className="hidden md:table-cell">{exercice.tempsApnee}s</TableCell>
              <TableCell className="hidden md:table-cell">{exercice.tempsExpiration}s</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <ExerciceForm exercice={exercice} />
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleteExercice.isPending}
                    onClick={() => {
                      if (confirm("Supprimer cet exercice preset ?")) {
                        deleteExercice.mutate({ id: exercice.id });
                      }
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

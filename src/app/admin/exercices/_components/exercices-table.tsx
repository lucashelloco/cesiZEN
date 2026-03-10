"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
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

  const deleteExercice = api.adminExercices.delete.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Cycles</TableHead>
            <TableHead>Inspiration</TableHead>
            <TableHead>Apnée</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                Aucun exercice preset
              </TableCell>
            </TableRow>
          )}
          {exercices.map((exercice) => (
            <TableRow key={exercice.id}>
              <TableCell className="font-medium">{exercice.nom}</TableCell>
              <TableCell>{exercice.nombreCycles}</TableCell>
              <TableCell>{exercice.tempsInspiration}s</TableCell>
              <TableCell>{exercice.tempsApnee}s</TableCell>
              <TableCell>{exercice.tempsExpiration}s</TableCell>
              <TableCell>
                <div className="flex gap-2">
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

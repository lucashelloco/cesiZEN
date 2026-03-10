"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContenuForm } from "./contenu-form";

type Contenu = {
  id: string;
  titre: string;
  corps: string;
  type: "ARTICLE" | "DOCUMENT";
  isPublished: boolean;
  createdAt: Date;
  auteur: { name: string; email: string };
};

export function ContenusTable({ contenus }: { contenus: Contenu[] }) {
  const router = useRouter();

  const togglePublish = api.adminContenus.togglePublish.useMutation({
    onSuccess: () => router.refresh(),
  });

  const deleteContenu = api.adminContenus.delete.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Auteur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contenus.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                Aucun contenu
              </TableCell>
            </TableRow>
          )}
          {contenus.map((contenu) => (
            <TableRow key={contenu.id}>
              <TableCell className="max-w-xs truncate font-medium">
                {contenu.titre}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{contenu.type}</Badge>
              </TableCell>
              <TableCell className="text-gray-500">{contenu.auteur.name}</TableCell>
              <TableCell>
                <Badge variant={contenu.isPublished ? "default" : "secondary"}>
                  {contenu.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-500">
                {new Date(contenu.createdAt).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <ContenuForm contenu={contenu} />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={togglePublish.isPending}
                    onClick={() =>
                      togglePublish.mutate({
                        id: contenu.id,
                        isPublished: !contenu.isPublished,
                      })
                    }
                  >
                    {contenu.isPublished ? "Dépublier" : "Publier"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleteContenu.isPending}
                    onClick={() => {
                      if (confirm("Supprimer ce contenu ?")) {
                        deleteContenu.mutate({ id: contenu.id });
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

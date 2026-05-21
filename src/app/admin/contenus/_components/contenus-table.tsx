"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useAnnounce } from "@/components/announcer-provider";
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
  const announce = useAnnounce();

  const togglePublish = api.adminContenus.togglePublish.useMutation({
    onSuccess: (_, variables) => {
      router.refresh();
      announce(variables.isPublished ? "Contenu publié" : "Contenu dépublié");
    },
  });

  const deleteContenu = api.adminContenus.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      announce("Contenu supprimé");
    },
  });

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Auteur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden md:table-cell">Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contenus.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                Aucun contenu
              </TableCell>
            </TableRow>
          )}
          {contenus.map((contenu) => (
            <TableRow key={contenu.id}>
              <TableCell className="max-w-[120px] sm:max-w-xs truncate font-medium">
                {contenu.titre}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline">{contenu.type}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{contenu.auteur.name}</TableCell>
              <TableCell>
                <Badge variant={contenu.isPublished ? "default" : "secondary"}>
                  {contenu.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {new Date(contenu.createdAt).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
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

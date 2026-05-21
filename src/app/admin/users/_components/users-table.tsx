"use client";

import { useState } from "react";
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

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
  _count: { contenus: number; exercices: number };
};

export function UsersTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const utils = api.useUtils();
  const announce = useAnnounce();

  const setRole = api.adminUsers.setRole.useMutation({
    onSuccess: async (_, variables) => {
      const updated = await utils.adminUsers.list.fetch();
      setUsers(updated);
      announce(`Rôle mis à jour : ${variables.role}`);
    },
  });

  const toggleActive = api.adminUsers.toggleActive.useMutation({
    onSuccess: async (_, variables) => {
      const updated = await utils.adminUsers.list.fetch();
      setUsers(updated);
      announce(variables.isActive ? "Compte activé" : "Compte désactivé");
    },
  });

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="hidden sm:table-cell">Statut</TableHead>
            <TableHead className="hidden lg:table-cell">Contenus</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={user.isActive ? "outline" : "destructive"}>
                  {user.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{user._count.contenus}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={setRole.isPending}
                    onClick={() =>
                      setRole.mutate({
                        userId: user.id,
                        role: user.role === "ADMIN" ? "USER" : "ADMIN",
                      })
                    }
                  >
                    {user.role === "ADMIN" ? "→ USER" : "→ ADMIN"}
                  </Button>
                  <Button
                    size="sm"
                    variant={user.isActive ? "destructive" : "outline"}
                    disabled={toggleActive.isPending}
                    onClick={() =>
                      toggleActive.mutate({
                        userId: user.id,
                        isActive: !user.isActive,
                      })
                    }
                  >
                    {user.isActive ? "Désactiver" : "Activer"}
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

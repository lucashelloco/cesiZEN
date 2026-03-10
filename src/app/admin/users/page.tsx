import { UsersTable } from "./_components/users-table";
import { api } from "@/trpc/server";

export default async function AdminUsersPage() {
  const users = await api.adminUsers.list();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "var(--brand-green)" }}>Utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  );
}

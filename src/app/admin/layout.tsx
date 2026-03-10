import { redirect } from "next/navigation";

import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 md:flex-row">
      <AdminSidebar userName={user.name} />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

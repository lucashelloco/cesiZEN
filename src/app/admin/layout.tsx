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
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar userName={user.name} />
      <main id="main-content" className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

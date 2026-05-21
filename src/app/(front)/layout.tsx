import { redirect } from "next/navigation";

import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";

export default async function FrontLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session?.user) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role === "ADMIN") redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 w-full px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authClient } from "@/server/better-auth/client";
import { ThemeToggle } from "@/app/_components/theme-toggle";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/contenus", label: "Contenus" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/exercices", label: "Exercices presets" },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            aria-current={active ? "page" : undefined}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "text-white"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            }`}
            style={active ? { backgroundColor: "var(--brand-green)" } : {}}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ userName: _userName }: { userName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Image src="/logo.png" alt="CesiZen" width={32} height={32} className="rounded" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex flex-col gap-1.5 p-1 text-foreground"
            aria-label="Menu admin"
          >
            <span className={`block h-0.5 w-5 bg-foreground transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile: drawer */}
      {open && (
        <div className="border-b border-border bg-card px-4 py-4 md:hidden">
          <NavLinks onClose={() => setOpen(false)} />
          <div className="mt-4 border-t border-border pt-4">
            <button
              onClick={async () => { await authClient.signOut(); window.location.href = "/login"; }}
              className="text-sm font-medium text-destructive hover:text-destructive/80"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}

      {/* Desktop: sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <Image src="/logo.png" alt="CesiZen" width={36} height={36} className="rounded" />
            <div>
              <p className="text-lg font-extrabold leading-none tracking-tight">
                <span style={{ color: "var(--brand-green)" }}>CESI</span>
                <span style={{ color: "var(--brand-yellow)" }}>ZEN</span>
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Back Office</p>
            </div>
          </div>
        </div>

        <NavLinks />

        <div className="mt-auto space-y-3 border-t border-border pt-4">
          <ThemeToggle />
          <button
            onClick={async () => { await authClient.signOut(); window.location.href = "/login"; }}
            className="text-sm font-medium text-destructive hover:text-destructive/80"
          >
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}

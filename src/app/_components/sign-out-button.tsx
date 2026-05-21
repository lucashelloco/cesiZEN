"use client";

import { authClient } from "@/server/better-auth/client";

export function SignOutButton() {
  return (
    <button
      className="btn btn-ghost text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-base-content dark:hover:bg-primary/15"
      onClick={async () => {
        await authClient.signOut();
        window.location.href = "/";
      }}
    >
      Se déconnecter
    </button>
  );
}

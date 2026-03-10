"use client";

import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await authClient.signOut();
        window.location.href = "/";
      }}
    >
      Se déconnecter
    </Button>
  );
}

import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { CookieBanner } from "@/app/_components/cookie-banner";
import { ThemeProvider } from "@/app/_components/theme-provider";

export const metadata: Metadata = {
  title: "CesiZen",
  description: "L'application de votre santé mentale",
  icons: [
    { rel: "icon", url: "/logo.png" },
    { rel: "apple-touch-icon", url: "/logo.png" },
  ],
  openGraph: {
    title: "CesiZen",
    description: "L'application de votre santé mentale",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

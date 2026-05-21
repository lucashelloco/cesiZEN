import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { CookieBanner } from "@/app/_components/cookie-banner";
import { ThemeProvider } from "@/app/_components/theme-provider";
import { AnnouncerProvider } from "@/components/announcer-provider";

export const metadata: Metadata = {
  title: "CesiZen",
  description: "L'application de votre santé mentale",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CesiZen",
  },
  formatDetection: { telephone: false },
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
      <head>
        <meta name="theme-color" content="#52a452" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[9999] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-md focus:outline-none"
        >
          Aller au contenu principal
        </a>
        <ThemeProvider>
          <AnnouncerProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <CookieBanner />
          </AnnouncerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

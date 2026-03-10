import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { CookieBanner } from "@/app/_components/cookie-banner";
import { ThemeProvider } from "@/app/_components/theme-provider";

export const metadata: Metadata = {
  title: "CesiZen",
  description: "L'application de votre santé mentale",
  icons: [
    { rel: "icon", url: "/logo.jpg" },
    { rel: "apple-touch-icon", url: "/logo.jpg" },
  ],
  openGraph: {
    title: "CesiZen",
    description: "L'application de votre santé mentale",
    images: [{ url: "/logo.jpg" }],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

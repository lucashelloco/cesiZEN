import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CesiZen",
    short_name: "CesiZen",
    description: "L'application de votre santé mentale",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#52a452",
    orientation: "portrait",
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["health", "lifestyle"],
  };
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import withPWA from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  // En-têtes de sécurité HTTP appliqués à toutes les réponses.
  // Protègent contre le clickjacking, le sniffing MIME, les fuites de referrer
  // et forcent HTTPS (HSTS). Voir plan de sécurisation §4.2.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

// En développement, Turbopack est utilisé (next dev --turbo) et next-pwa injecte
// une config Webpack incompatible — on n'applique le wrapper PWA qu'en production.
export default process.env.NODE_ENV === "development"
  ? config
  : withPWA({
      dest: "public",
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
    })(config);

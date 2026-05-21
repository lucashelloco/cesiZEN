/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import withPWA from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {};

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

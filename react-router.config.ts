import type { Config } from "@react-router/dev/config"

export default {
  // Server-side rendering, matching how this app has always been served.
  ssr: true,
  // Where the app is mounted. Unset means the root, as DCHP-3 has always
  // been; the archive editions sit under /dchp1 and /dchp2 on the same host.
  // Links, forms, route matching and loader redirects follow it; only
  // request.url in loaders still carries the raw prefix (see
  // app/editions/basename.server.ts). Vite's `base` (vite.config.ts) is the
  // same string, which the dev server requires, so the built assets are
  // served from the same prefix.
  basename: `${process.env.DCHP_BASENAME || ""}/`,
} satisfies Config

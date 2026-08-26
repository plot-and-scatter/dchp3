/// <reference types="vite/client" />

import { fileURLToPath } from "node:url"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    // Vite would default to 5173, but this app's dev port is part of its
    // contract: SITE_URL in .env feeds the Auth0 callback URL registered in
    // the Auth0 dashboard, and both test:e2e:dev and cypress.config.ts assume
    // 3000. react-router-serve already defaults to 3000, so this keeps dev and
    // production on the same port, as they were under the classic compiler.
    port: 3000,
    // Fail loudly rather than sliding to 3001 when something already holds
    // 3000 — a silent fallback once left a stale server serving the previous
    // night's code while the real one sat on another port.
    strictPort: true,
  },
  resolve: {
    // The `~/*` -> `app/*` alias is spelled out rather than read from
    // tsconfig: @react-router/dev@7 carries its own nested Vite 7 (via
    // vite-node), so Vite 8's native `resolve.tsconfigPaths` — which
    // vitest.config.mts does use — is not available to this build.
    alias: [
      {
        find: /^~\//,
        replacement: fileURLToPath(new URL("./app/", import.meta.url)),
      },
      // A handful of modules import the repo-root `utils/` directory bare
      // ("utils/source"), which the classic compiler resolved through
      // tsconfig's `baseUrl: "."`. Vite does not implement baseUrl, so the
      // same mapping is declared explicitly.
      {
        find: /^utils\//,
        replacement: fileURLToPath(new URL("./utils/", import.meta.url)),
      },
    ],
  },
})

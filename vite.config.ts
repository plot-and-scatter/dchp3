/// <reference types="vite/client" />

import { fileURLToPath } from "node:url"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [reactRouter()],
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

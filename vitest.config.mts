/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// app/root.tsx imports "./styles/tailwind.css?url", and that file is generated
// by `npm run generate:css` and gitignored. Any test that reaches root.tsx --
// importing a route module is enough, since routes read BASE_APP_TITLE from it
// -- would otherwise fail to resolve it on a clean checkout. That passed
// locally only because a previous build had left the file lying around, and
// failed in CI, where the Vitest job never generates it.
//
// Unit tests have no use for the real stylesheet, so the URL is stubbed rather
// than making them depend on Tailwind having run.
const stubCssUrlImports: Plugin = {
  name: "stub-css-url-imports",
  enforce: "pre",
  resolveId(source) {
    return source.endsWith(".css?url") ? "\0stub-css-url" : null
  },
  load(id) {
    return id === "\0stub-css-url" ? 'export default "/stubbed.css"' : null
  },
}

export default defineConfig({
  plugins: [stubCssUrlImports, react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
  },
})

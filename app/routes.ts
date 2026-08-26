import { createRoutesFromFolders } from "../vendor/createRoutesFromFolders"
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter"
import type { RouteConfig } from "@react-router/dev/routes"

// The app keeps its v1 nested-folder route layout. This is the same
// createRoutesFromFolders call that used to live in remix.config.js, now
// wrapped in the adapter React Router provides for exactly this purpose.
// Converting the route files to flat routes remains a separate project.
export default remixRoutesOptionAdapter((defineRoutes) =>
  createRoutesFromFolders(defineRoutes, {
    ignoredFilePatterns: [
      "**/.*",
      "**/*.css",
      "**/*.test.{js,jsx,ts,tsx}",

      // Two helper modules live alongside the routes but are not routes:
      // neither has a default export, a loader or an action. The classic
      // compiler registered them as empty, unreachable routes; Vite would
      // treat them as real route modules. Moving them under app/models is
      // the tidier end state, as the reference schemas already were.
      "entries/$headword/handleEditFormAction.ts",
      "search/searchResultEnum.ts",
    ],
  })
) satisfies RouteConfig

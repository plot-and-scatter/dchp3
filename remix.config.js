const { createRoutesFromFolders } = require("@remix-run/v1-route-convention")

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // The v2_* future flags this app used to carry are all defaults in Remix 2,
  // so they are gone. Each was proven on 1.19 first: v2_errorBoundary long
  // ago, then v2_headers and v2_normalizeFormMethod (#420), v2_meta (#422)
  // and serverModuleFormat: "esm" (#423), which is also the v2 default.

  // The app keeps its v1 nested-folder route layout. createRoutesFromFolders
  // generates the identical route table from the same files — verified by
  // diffing `remix routes` against main. Converting all 58 route files to
  // flat routes is a separate project, deliberately not bundled in here.
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes, {
      ignoredFilePatterns: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
    })
  },
  // Required alongside the `routes` function above: it stops Remix from also
  // running its own flat-route scan, which would define /auth, /editHistory
  // and /profile twice. This is the pattern from the v2 migration guide, and
  // it only works on Remix 2 — on 1.19 it crashed the flat-route scanner.
  ignoredRouteFiles: ["**/*"],
  cacheDirectory: "./node_modules/.cache/remix",
}

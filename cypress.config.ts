import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    // Named explicitly rather than left to auto-detection: when the support
    // file is not loaded, custom commands like cy.visitAndCheck and the
    // @testing-library findBy* helpers simply do not exist, and the failure
    // shows up as "cy.visitAndCheck is not a function" in the spec.
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges
      const port = process.env.PORT ?? (isDev ? "3000" : "8811")
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      }

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on("task", {
        log: (message) => {
          console.log(message)

          return null
        },
      })

      // Return only the overrides. Returning the whole resolved config back
      // to Cypress is not the documented contract and risks clobbering values
      // Cypress resolved for itself.
      return configOverrides
    },
  },
})

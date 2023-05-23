// import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser()
  })

  it("should allow you to list entries", () => {
    cy.visitAndCheck("/")
    cy.findByRole("link", { name: /entries/i }).click()
  })
})

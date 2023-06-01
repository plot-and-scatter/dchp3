// import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to list entries", () => {
    cy.visitAndCheck("/entries/browse/c/1")
    cy.findByText("Cabbagetown")
  })
})

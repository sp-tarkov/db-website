describe("Header", () => {
  beforeEach(() => {
    cy.window()
      .its("sessionStorage")
      .invoke("removeItem", "locales");

    cy.intercept("**/api/locales", { middleware: true }, (req) => {
      req.on("before:response", (res) => {
        // force all API responses to not be cached
        res.headers["cache-control"] = "no-store";
      });
    }).as("getLocaleList");
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  describe("Test links", () => {
    beforeEach(() => {
      cy.visit("/");

      cy.intercept("GET", "**/api/locales", { body: [] }).as("getLocaleListWithoutData");
    });

    it("should display the website link and contain the right url", () => {
      cy.get("#website-link")
        .should("be.visible")
        .contains("a", "Website")
        .should("have.attr", "href")
        .should("not.be.empty")
        .and("include", Cypress.env("VITE_SPTARKOV_HOME"));
    });

    it("should display the workshop link and contain the right url", () => {
      cy.get("#workshop-link")
        .should("be.visible")
        .contains("a", "Workshop")
        .should("have.attr", "href")
        .should("not.be.empty")
        .and("include", Cypress.env("VITE_SPTARKOV_WORKSHOP"));
    });

    it("should display the documentation link and contain the right url", () => {
      cy.get("#documentation-link")
        .should("be.visible")
        .contains("a", "Documentation")
        .should("have.attr", "href")
        .should("not.be.empty")
        .and("include", Cypress.env("VITE_SPTARKOV_DOCUMENTATION"));
    });
  });
});

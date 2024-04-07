import item from "@fixtures/item.json";
import hierarchy from "@fixtures/hierarchy.json";

describe("Search Area", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/locales", { body: ["en", "fr"] }).as("getLocaleList");
    cy.intercept("GET", /.*\/api\/item\?.*/, { body: item }).as("getItem");
    cy.intercept("POST", "**/api/search*", { body: [] }).as("searchItem");
    cy.intercept("GET", "**/api/item/hierarchy*", { body: hierarchy }).as("getItemHierarchy");

    cy.visit("/");
  });

  it("default layout", () => {
    cy.get("#navigation-breadcrumb")
      .should("be.visible");

    cy.get("#home-breadcrumb")
      .should("be.visible")
      .contains("a", "Home")
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("include", "/");

    cy.get("#search-autocomplete")
      .should("be.visible");

    cy.get("#search-autocomplete-label")
      .should("be.visible")
      .contains("label", "Search by name or ID");

    cy.get("#search-no-data")
      .should("be.visible")
      .contains("p", "No data to display");
  });

  describe("Searching", () => {
    it("Search using ID displays the json with locale", () => {
      cy.get("#search-autocomplete")
        .type(item.item._id)
        .type("{ENTER}")
        .should("have.value", item.locale.Name);

      cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${item.item._id}")`)
        .should("have.length", 1)
        .invoke("text")
        .should("eq", `"${item.item._id}"`);

      cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${item.locale.Name}")`)
        .should("have.length.above", 0);
    });
  });
});

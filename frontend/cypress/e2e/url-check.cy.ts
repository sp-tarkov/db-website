import item from "@fixtures/item.json";
import hierarchy from "@fixtures/hierarchy.json";

describe("URL Check", () => {
  beforeEach(() => {
    cy.window()
      .its("sessionStorage")
      .invoke("removeItem", "locales");

    cy.intercept("GET", "**/api/locales", { body: [] }).as("getLocaleList");
    cy.intercept("GET", /.*\/api\/item\?.*/, { body: item }).as("getItem");
    cy.intercept("POST", "**/api/search*", { body: [] }).as("searchItem");
    cy.intercept("GET", "**/api/item/hierarchy*", { body: hierarchy }).as("getItemHierarchy");
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  describe("Check page not found", () => {
    it("should redirect to page not found if url does not exist", () => {
      cy.visit("/ABC");
      cy.get("#not-found-message").contains("This page does not exist!");
    });
  });

  describe("Check root redirection", () => {
    it("should redirect to /search if url is /", () => {
      cy.visit("/");
      cy.url().should("include", "/search");
    });
  });

  describe("Check url changes with search input", () => {
    it("ID in url applies search", () => {
      cy.visit(`/search/${item.item._id}`);
      cy.get("#search-autocomplete").should("have.value", item.locale.Name);
    });

    it("Search reflects in url", () => {
      cy.visit("/");
      cy.get("#search-autocomplete")
        .type(item.item._id)
        .type("{ENTER}")
        .should("have.value", item.locale.Name);
      cy.url().should("include", `/search/${item.item._id}`);
      cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${item.item._id}")`)
        .should("have.length", 1)
        .invoke("text")
        .should("eq", `"${item.item._id}"`);
    });
  });
});

import { useJsonViewerThemeStore } from "@src/store/json-viewer-theme";

describe("JSON Theme", () => {
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

  describe("JSON Theme Selector", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/locales", { body: [] }).as("getLocaleListWithoutData");
    });

    describe("when local storage is not set", () => {
      beforeEach(() => {
        cy.visit("/", {
          onBeforeLoad: (window) => {
            window.localStorage.removeItem("json-viewer-theme");
          }
        });
      });

      it("should display the json theme selector and be functional", () => {
        cy.get("#json-selector")
          .should("be.visible")
          .click({ force: true })
          .then(() => {
            cy.get("[role=\"option\"]").contains("mocha").click({ force: true });
          });
      });
    });

    describe("when local storage is set", () => {
      beforeEach(() => {
        cy.visit("/", {
          onBeforeLoad: () => {
            useJsonViewerThemeStore.getState().setThemeMode("eighties");
          }
        });
      });

      it("should have the correct theme value in the json theme selector", () => {
        cy.get("#json-selector")
          .should("be.visible")
          .contains("eighties");
      });
    });
  });
});
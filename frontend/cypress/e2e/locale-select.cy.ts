import { useLocaleStore } from "@src/store/locale";

describe("Locale Select", () => {
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

  describe("Locale Selector", () => {
    describe("when no locale is available", () => {
      before(() => {
        cy.intercept("GET", "**/api/locales", { body: [] }).as("getLocaleListWithoutData");

        cy.visit("/", {
          onBeforeLoad: (window) => {
            window.localStorage.removeItem("locale");
          }
        });
      });

      it("should not display the locale selector", () => {
        cy.visit("/");
        cy.get("#locale-selector")
          .should("be.visible")
          .click({ force: true })
          .then(() => {
            cy.get("[role=\"option\"]").should("not.contain", "locale2");
          });
      });
    });

    describe("when locales are available", () => {
      beforeEach(() => {
        cy.intercept("GET", "**/api/locales", { body: ["locale1", "locale2", "locale3"] }).as("getLocaleListWithData");
      });

      describe("and no local storage is detected", () => {
        beforeEach(() => {
          cy.visit("/", {
            onBeforeLoad: (window) => {
              window.localStorage.removeItem("locale");
            }
          });
        });

        it("should display the locale selector and be functional", () => {
          cy.get("#locale-selector")
            .should("be.visible")
            .click({ force: true })
            .then(() => {
              cy.get("[data-value=\"locale3\"]").contains("locale3").click({ force: true });
            });
        });
      });

      describe("and local storage is detected", () => {
        beforeEach(() => {
          cy.visit("/", {
            onBeforeLoad: () => {
              useLocaleStore.getState().setPreferedLocale("locale2");
            }
          });
        });

        it("should display the locale selector and be functional", () => {
          cy.get("#locale-selector")
            .should("be.visible")
            .contains("locale2");
        });
      });
    });
  });
});

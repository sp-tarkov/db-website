import { useThemeStore } from "@src/store/theme";

describe("Dark Mode Toggle", () => {
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

    cy.intercept("GET", "**/api/locales", { body: [] }).as("getLocaleListWithoutData");
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  describe("Theme Initializer", () => {
    describe("when local storage is not set", () => {
      it("should match dark theme when prefers-color-scheme is dark", () => {
        cy.visit("/", {
          onBeforeLoad: (window) => {
            window.localStorage.removeItem("theme");
            cy.stub(window, "matchMedia")
              .withArgs("(prefers-color-scheme: dark)")
              .returns({
                matches: true,
                addListener: () => {},
                removeListener: () => {}
              });
          }
        });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "dark mode");

        cy.get("[data-testid=\"Brightness7Icon\"]")
          .should("be.visible");
      });

      it("should match light theme when prefers-color-scheme is light", () => {
        cy.visit("/", {
          onBeforeLoad: (window) => {
            window.localStorage.removeItem("theme");
            cy.stub(window, "matchMedia")
              .withArgs("(prefers-color-scheme: dark)")
              .returns({
                matches: false,
                addListener: () => {},
                removeListener: () => {}
              });
          }
        });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "light mode");

        cy.get("[data-testid=\"Brightness4Icon\"]")
          .should("be.visible");
      });
    });

    describe("when local storage is set", () => {
      it("should match dark if theme is set to dark", () => {
        cy.visit("/", {
          onBeforeLoad: () => {
            useThemeStore.getState().setCheckedPreferredColorScheme();
            useThemeStore.getState().setThemeMode("dark");
          }
        });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "dark mode");

        cy.get("[data-testid=\"Brightness7Icon\"]")
          .should("be.visible");
      });

      it("should match light if theme is set to light", () => {
        cy.visit("/", {
          onBeforeLoad: () => {
            useThemeStore.getState().setCheckedPreferredColorScheme();
            useThemeStore.getState().setThemeMode("light");
          }
        });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "light mode");

        cy.get("[data-testid=\"Brightness4Icon\"]")
          .should("be.visible");
      });
    });
  });

  describe("Theme Toggle", () => {
    describe("toggle from dark to light", () => {
      beforeEach(() => {
        cy.visit("/", {
          onBeforeLoad: () => {
            useThemeStore.getState().setCheckedPreferredColorScheme();
            useThemeStore.getState().setThemeMode("dark");
          }
        });
      });

      it("should be visible and functional", () => {
        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "dark mode");

        cy.get("[data-testid=\"Brightness7Icon\"]")
          .should("be.visible");

        cy.get("#modeToggleButton")
          .should("be.visible")
          .click({ force: true });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "light mode");

        cy.get("[data-testid=\"Brightness4Icon\"]")
          .should("be.visible");
        });
    });

    describe("toggle from light to dark", () => {
      beforeEach(() => {
        cy.visit("/", {
          onBeforeLoad: () => {
            useThemeStore.getState().setCheckedPreferredColorScheme();
            useThemeStore.getState().setThemeMode("light");
          }
        });
      });

      it("should be visible and functional", () => {
        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "light mode");

        cy.get("[data-testid=\"Brightness4Icon\"]")
          .should("be.visible");

        cy.get("#modeToggleButton")
          .should("be.visible")
          .click({ force: true });

        cy.get("#themeToggleContainer")
          .should("be.visible")
          .should("have.text", "dark mode");

        cy.get("[data-testid=\"Brightness7Icon\"]")
          .should("be.visible");
        });
    });
  });
});

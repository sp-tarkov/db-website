export {};

describe('Dark Mode Toggle', () => {
    beforeEach(() => {
        cy.window()
            .its("sessionStorage")
            .invoke("removeItem", "db.sp-tarkov.com-locales");

        cy.intercept(
            '**/api/locales',
            { middleware: true },
            (req) => {
                req.on('before:response', (res) => {
                    // force all API responses to not be cached
                    res.headers['cache-control'] = 'no-store'
                })
            }
        ).as('getLocales');
    })

    afterEach(()=> {
        cy.clearLocalStorage();
    })

    describe('Theme toggle', () => {
        beforeEach(()=>{
            cy.intercept({
                method: 'GET',
                url: '**/api/locales'}, {
                statusCode: 200,
                body: []
            }).as('getLocalesWithoutData');
        })
        describe('If no localStorage is set',() =>{
            before(() => {
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.removeItem('db.sp-tarkov.com-prefered-color-scheme')
                    }
                })
            })

            it('theme shoud match light', () => {
                cy.get('#modeToggleButtonHolder')
                    .should('be.visible')
                    .should('have.text', 'light mode');

                cy.get('[data-testid="Brightness4Icon"]')
                    .should('be.visible');
            })
        })


        describe('If localStorage is set to light',() =>{
            before(() => {
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.setItem('db.sp-tarkov.com-prefered-color-scheme', 'light')
                    }
                })
            })

            it('theme shoud match light', () => {
                cy.get('#modeToggleButtonHolder')
                    .should('be.visible')
                    .should('have.text', 'light mode');

                cy.get('[data-testid="Brightness4Icon"]')
                    .should('be.visible');
            })
        })

        describe('If localStorage is set to dark',() =>{
            before(() => {
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.setItem('db.sp-tarkov.com-prefered-color-scheme', 'dark')
                    }
                })
            })

            it('theme shoud match dark if localStorage is set to dark', () => {
                cy.get('#modeToggleButtonHolder')
                    .should('be.visible')
                    .should('have.text', 'dark mode');

                cy.get('[data-testid="Brightness7Icon"]')
                    .should('be.visible');
            })
        })

        describe('Theme toggle',() =>{
            describe('Toggle from light to dark', ()=>{
                before(() => {
                    cy.visit('/', {
                        onBeforeLoad: function (window) {
                            window.localStorage.setItem('db.sp-tarkov.com-prefered-color-scheme', 'light')
                        }
                    })
                })
                it('should be visible and functionnal', () => {
                    cy.get('#modeToggleButtonHolder')
                        .should('be.visible')
                        .should('have.text', 'light mode');

                    cy.get('[data-testid="Brightness4Icon"]')
                        .should('be.visible');

                    cy.get('#modeToggleButton')
                        .should('be.visible')
                        .click({force: true});

                    cy.get('[data-testid="Brightness7Icon"]')
                        .should('be.visible');

                    cy.get('#modeToggleButtonHolder')
                        .should('be.visible')
                        .should('have.text', 'dark mode');
                })
            })

            describe('Toggle from dark to light', ()=>{
                before(() => {
                    cy.visit('/', {
                        onBeforeLoad: function (window) {
                            window.localStorage.setItem('db.sp-tarkov.com-prefered-color-scheme', 'dark')
                        }
                    })
                })
                it('should be visible and functionnal', () => {
                    cy.get('[data-testid="Brightness7Icon"]')
                        .should('be.visible');

                    cy.get('#modeToggleButtonHolder')
                        .should('be.visible')
                        .should('have.text', 'dark mode');

                    cy.get('#modeToggleButton')
                        .should('be.visible')
                        .click({force: true});

                    cy.get('#modeToggleButtonHolder')
                        .should('be.visible')
                        .should('have.text', 'light mode');

                    cy.get('[data-testid="Brightness4Icon"]')
                        .should('be.visible');
                })
            })
        })
    })
})
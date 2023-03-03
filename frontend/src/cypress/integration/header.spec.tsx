export {};

describe('Header', () => {
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

    describe('Test links', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.intercept({
                method: 'GET',
                url: '**/api/locales'}, {
                statusCode: 200,
                body: []
            });
        })
        it('website link shoud be visible and contains the right url', () => {
            cy.get('#website-link')
                .should('be.visible')
                .contains('a', 'Website')
                .should('have.attr', 'href')
                    .should('not.be.empty')
                    .and('include',Cypress.env('REACT_APP_SPTARKOV_HOME'));
        })

        it('workshop link shoud be visible and contains the right url', () => {
            cy.get('#workshop-link')
                .should('be.visible')
                .contains('a', 'Workshop')
                .should('have.attr', 'href')
                    .should('not.be.empty')
                    .and('include',Cypress.env('REACT_APP_SPTARKOV_WORKSHOP'));
        })

        it('documentation link shoud be visible and contains the right url', () => {
            cy.get('#documentation-link')
                .should('be.visible')
                .contains('a', 'Documentation')
                .should('have.attr', 'href')
                    .should('not.be.empty')
                    .and('include',Cypress.env('REACT_APP_SPTARKOV_DOCUMENTATION'));
        })
    })
})
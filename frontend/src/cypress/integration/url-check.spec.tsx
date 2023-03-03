import condensedMilk from '../fixtures/condensed_milk.json'

export {};

describe('Url check', () => {
    beforeEach(() => {
        cy.window()
            .its("sessionStorage")
            .invoke("removeItem", "db.sp-tarkov.com-locales");

        cy.intercept({
            method: 'GET',
            url: '**/api/locales'
        }, {
            statusCode: 200,
            body: []
        }).as('getLocalesWithoutData');

        cy.intercept({
            method: 'GET',
            url: '**/api/item?*'
        }, {
            statusCode: 200,
            body: condensedMilk
        })

        cy.intercept({
            method: 'POST',
            url: '**/api/search*'
        }, {
            statusCode: 200,
            body: []
        })


        cy.intercept({
            method: 'GET',
            url: '**/api/item/hierarchy*'
        }, {
            statusCode: 200,
            body: condensedMilk
        })
    })

    afterEach(() => {
        cy.clearLocalStorage();
    })

    describe('Check page not found', () => {
        it('Invalid url should redirect to page not found', () => {
            cy.visit('/ABC')
            cy.get('#not-found-message').contains("This page does not exist !");
        })
    })

    describe('Check root redirection', () => {
        it('Root should redirect to search', () => {
            cy.visit('/')
            cy.url().should("include", "/search");
        })
    })

    describe('Check url changes with search input', () => {
        it('ID in url applies search', () => {
            cy.visit(`/search/${condensedMilk.item._id}`);
            cy.get('#search-autocomplete').should('have.value', condensedMilk.locale.Name)
        })

        it('Search reflects in url', () => {
            cy.visit(`/`);
            cy.get('#search-autocomplete')
                .type(condensedMilk.item._id)
                .type('{ENTER}')
                .should('have.value', condensedMilk.locale.Name);
            cy.url().should("include", `/search/${condensedMilk.item._id}`);
            cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${condensedMilk.item._id}")`)
                .should('have.length', 1)
                .invoke('text')
                .should('eq', `"${condensedMilk.item._id}"`);
        })
    })
})
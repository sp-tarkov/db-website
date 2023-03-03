import condensedMilk from "../fixtures/condensed_milk.json";

export {};

describe('Search area', ()=>{
    beforeEach(() => {
        cy.intercept({
            method: 'GET',
            url: '**/api/locales'
        }, {
            statusCode: 200,
            body: ['locale1', 'locale2']
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

        cy.visit('/');
    })

    it('default layout', () => {
        cy.get('#navigation-breadcrumb')
            .should('be.visible');

        cy.get('#home-breadcrumb')
            .should('be.visible')
            .contains('a', 'Home')
            .should('have.attr', 'href')
                .should('not.be.empty')
                .and('include', '/');

        cy.get('#search-autocomplete')
            .should('be.visible');
        cy.get('#search-autocomplete-label')
            .should('be.visible')
            .contains('label', 'Search by name or ID');

        cy.get('#search-no-data')
            .should('be.visible')
            .contains('p', 'No data to display');
    })

    describe('Searching', () => {
        it('Search using ID displays the json with locale', () => {
            cy.get('#search-autocomplete')
                .type(condensedMilk.item._id)
                .type('{ENTER}')
                .should('have.value', condensedMilk.locale.Name)
            cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${condensedMilk.item._id}")`)
                .should('have.length', 1)
                .invoke('text')
                .should('eq', `"${condensedMilk.item._id}"`);
            cy.get(`.react-json-view .object-key-val > .pushed-content > .object-content > .variable-row > .variable-value > div > .string-value:contains("${condensedMilk.locale.Name}")`)
                .should('have.length.above', 0);
        })
    })
})
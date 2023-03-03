export {};

describe('Json Theme', () => {
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

    describe('Json theme selector', () => {
        beforeEach(() => {
            cy.intercept({
                method: 'GET',
                url: '**/api/locales'}, {
                statusCode: 200,
                body: []
            });
        })
        describe('When local storage is not set',() => {
            before(() => {
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.removeItem('db.sp-tarkov.com-prefered-json-theme')
                    }
                });
            })

            it('json theme selector shoud be visible and functional', () => {
                cy.get('#json-selector')
                    .should('be.visible')
                    .click({force: true})
                    .then(option =>{
                        cy.get('[role="option"]').contains('mocha').click({force: true});
                    });
            })
        })

        describe('When local storage is set', () => {
            before(() => {
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.setItem('db.sp-tarkov.com-prefered-json-theme', 'eighties')
                    }
                });
            })

            it('json theme selector shoud have the right value', () => {
                cy.get('#json-selector')
                    .should('be.visible')
                    .contains('eighties');
            })
        })
    })
})
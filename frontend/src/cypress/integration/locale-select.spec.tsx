export {};

describe('Locale select', () => {
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

    describe('Locale selector', () => {
        describe('when no locale is available', () => {
            before(() => {
                cy.intercept({
                    method: 'GET',
                    url: '**/api/locales'},
                []).as('getLocalesWithoutData');
                cy.visit('/', {
                    onBeforeLoad: function (window) {
                        window.localStorage.removeItem('db.sp-tarkov.com-prefered-locale')
                    }
                })
            })

            it('language selector shoud be visible', () => {
                cy.get('#locale-selector')
                    .should('be.visible')
                    .click({force: true})
                    .then(option =>{
                        cy.get('[role="option"]').should('not.contain', 'locale2');
                    });
            })
        })

        describe('when locales are available', () => {
            beforeEach(() => {
                cy.intercept({
                    method: 'GET',
                    url: '**/api/locales'},
                ['locale1', 'locale2', 'locale3'])
                .as('getLocalesWithData');
                cy.visit('/');
            })

            describe('and no local storage is detected', () => {
                before(() => {
                    cy.visit('/', {
                        onBeforeLoad: function (window) {
                            window.localStorage.removeItem('db.sp-tarkov.com-prefered-locale')
                        }
                    })
                })
                it('language selector shoud be visible and functional', () => {
                    cy.get('#locale-selector')
                        .should('be.visible')
                        .click({force: true})
                        .then(option =>{
                            cy.get('[data-value="locale3"]').contains('locale3').click({force: true});
                        });
                })
            })
            describe('and local storage is detected', () => {
                before(() => {
                    cy.visit('/', {
                        onBeforeLoad: function (window) {
                            window.localStorage.setItem('db.sp-tarkov.com-prefered-locale', 'locale2')
                        }
                    })
                })
                it('language selector shoud be visible and functional', () => {
                    cy.get('#locale-selector')
                        .should('be.visible')
                        .contains('locale2');
                })
            })
        })
    })

})
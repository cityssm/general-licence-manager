import { testAdmin } from '../../../test/_globals.js';
import { ajaxDelayMillis, login, logout } from '../../support/index.js';
function isJanuary() {
    return new Date().getMonth() === 1 - 1;
}
function proceedIfNotJanuary() {
    if (!isJanuary()) {
        cy.get("button[data-cy='proceed']").click();
    }
}
describe('Admin - Year-End Process', () => {
    beforeEach('Loads Page', () => {
        logout();
        login(testAdmin);
        cy.visit('/admin/yearEnd');
        cy.location('pathname').should('equal', '/admin/yearEnd');
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.injectAxe();
        cy.checkA11y();
        proceedIfNotJanuary();
        cy.checkA11y();
    });
    it('Refreshes the database', () => {
        proceedIfNotJanuary();
        cy.get("a[data-cy='backup']").click();
        cy.get('.modal').should('be.visible').should('contain.text', 'Backup');
        cy.get(".modal button[data-cy='ok']").click();
        cy.wait(ajaxDelayMillis);
        cy.get('.modal')
            .should('contain.text', 'Backed Up')
            .should('contain.text', 'Success');
        cy.get(".modal button[data-cy='ok']").click();
        cy.get("a[data-cy='refresh']").click();
        cy.get('.modal').should('be.visible').should('contain.text', 'Refresh');
        cy.get(".modal button[data-cy='ok']").click();
        cy.wait(ajaxDelayMillis);
        cy.get('.modal')
            .should('contain.text', 'Refresh')
            .should('contain.text', 'Success');
        cy.get(".modal button[data-cy='ok']").click();
    });
});

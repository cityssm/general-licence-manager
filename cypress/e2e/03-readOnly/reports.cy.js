import { testView } from '../../../test/_globals.js';
import { ajaxDelayMillis, login, logout } from '../../support/index.js';
describe('Reports', () => {
    beforeEach(() => {
        logout();
        login(testView);
        cy.visit('/reports');
    });
    afterEach(logout);
    it('Loads page', () => {
        cy.location('pathname').should('equal', '/reports');
        const hiddenReportsSelector = "a.is-hidden[download][href*='/reports/']";
        cy.get(hiddenReportsSelector).should('exist');
        cy.get("button[data-cy='panel-toggle']").each(($toggleButton) => {
            cy.wrap($toggleButton).click();
        });
        cy.get(hiddenReportsSelector).should('not.exist');
        cy.injectAxe();
        cy.checkA11y();
        cy.get("a:not(.is-hidden)[download][href*='/reports/']").each(($reportLink) => {
            cy.wrap($reportLink).click();
            cy.wait(ajaxDelayMillis);
        });
        cy.get("form[action*='/reports/']").each(($reportLink) => {
            cy.wrap($reportLink).invoke('attr', 'target', '_blank').submit();
            cy.wait(ajaxDelayMillis);
        });
    });
});

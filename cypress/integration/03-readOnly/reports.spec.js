import { testView } from "../../../test/_globals.js";
import { logout, login, ajaxDelayMillis } from "../../support/index.js";
describe("Reports", function () {
    before(function () {
        logout();
        login(testView);
        cy.visit("/reports");
    });
    after(logout);
    it("Loads page", function () {
        cy.location("pathname").should("equal", "/reports");
    });
    it("Makes all reports visible", function () {
        var hiddenReportsSelector = "a.is-hidden[download][href*='/reports/']";
        cy.get(hiddenReportsSelector)
            .should("exist");
        cy.get("button[data-cy='panel-toggle']").each(function ($toggleButton) {
            cy.wrap($toggleButton).click();
        });
        cy.get(hiddenReportsSelector)
            .should("not.exist");
    });
    it("Has no detectable accessibility issues", function () {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Exports all reports", function () {
        cy.get("a:not(.is-hidden)[download][href*='/reports/']").each(function ($reportLink) {
            cy.wrap($reportLink).click();
            cy.wait(ajaxDelayMillis);
        });
    });
});

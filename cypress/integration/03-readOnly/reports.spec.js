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
    it("Has no detectable accessibility issues", function () {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Exports all reports", function () {
        cy.get("a[download][href*='/reports/']").each(function ($reportLink) {
            cy.wrap($reportLink).click();
            cy.wait(ajaxDelayMillis);
        });
    });
});

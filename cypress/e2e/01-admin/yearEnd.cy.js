import { testAdmin } from "../../../test/_globals.js";
import { logout, login, ajaxDelayMillis } from "../../support/index.js";
describe("Admin - Year-End Process", function () {
    before(function () {
        logout();
        login(testAdmin);
    });
    after(logout);
    beforeEach("Loads page", function () {
        cy.visit("/admin/yearEnd");
        cy.location("pathname").should("equal", "/admin/yearEnd");
    });
    it("Has no detectable accessibility issues", function () {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Refreshes the database", function () {
        if (new Date().getMonth() !== 1 - 1) {
            cy.get("button[data-cy='proceed']").click();
        }
        cy.get("a[data-cy='backup']").click();
        cy.get(".modal")
            .should("be.visible")
            .should("contain.text", "Backup");
        cy.get(".modal button[data-cy='ok']")
            .click();
        cy.wait(ajaxDelayMillis);
        cy.get(".modal")
            .should("contain.text", "Backed Up")
            .should("contain.text", "Success");
        cy.get(".modal button[data-cy='ok']")
            .click();
        cy.get("a[data-cy='refresh']").click();
        cy.get(".modal")
            .should("be.visible")
            .should("contain.text", "Refresh");
        cy.get(".modal button[data-cy='ok']")
            .click();
        cy.wait(ajaxDelayMillis);
        cy.get(".modal")
            .should("contain.text", "Refresh")
            .should("contain.text", "Success");
        cy.get(".modal button[data-cy='ok']")
            .click();
    });
});

import { testView } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Read Only User", function () {
    before(logout);
    after(logout);
    it("Logs In Successfully", function () {
        login(testView);
    });
    describe("Dashboard", function () {
        before(function () {
            cy.visit("/dashboard");
        });
        it("Has no detectable accessibility issues", function () {
            cy.injectAxe();
            cy.checkA11y();
        });
        it("Has no links to new licences", function () {
            cy.get("a[href*='/new']")
                .should("not.exist");
        });
        it("Has no links to admin areas", function () {
            cy.get("a[href*='/admin']")
                .should("not.exist");
        });
    });
    describe("Licence Search", function () {
        before(function () {
            cy.visit("/licences");
        });
        it("Loads page", function () {
            cy.location("pathname").should("equal", "/licences");
        });
        it("Has no links to new licence", function () {
            cy.get("a[href*='/new']")
                .should("not.exist");
        });
    });
    describe("Create a Licence", function () {
        it("Redirects to Dashboard", function () {
            cy.visit("/licences/new");
            cy.location("pathname").should("equal", "/dashboard");
        });
    });
    describe("Reports", function () {
        before(function () {
            cy.visit("/reports");
        });
        it("Loads page", function () {
            cy.location("pathname").should("equal", "/reports");
        });
        it("Has no detectable accessibility issues", function () {
            cy.injectAxe();
            cy.checkA11y();
        });
    });
    describe("Admin - Licence Categories", function () {
        it("Redirects to Dashboard", function () {
            cy.visit("/admin/licenceCategories");
            cy.location("pathname").should("not.contain", "/admin");
        });
    });
});

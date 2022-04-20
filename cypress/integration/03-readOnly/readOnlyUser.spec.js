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
    it("Has no link to create licences on Licence Search", function () {
        cy.visit("/licences");
        cy.get("a[href*='/new']")
            .should("not.exist");
    });
    it("Redirects to Dashboard when attempting to create a licence", function () {
        cy.visit("/licences/new");
        cy.location("pathname").should("equal", "/dashboard");
    });
    it("Redirects to Dashboard when attempting to alter licence categories", function () {
        cy.visit("/admin/licenceCategories");
        cy.location("pathname").should("not.contain", "/admin");
    });
});

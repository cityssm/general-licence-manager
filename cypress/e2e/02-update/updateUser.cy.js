import { testUpdate } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Update User", function () {
    before(logout);
    after(logout);
    it("Logs In Successfully", function () {
        login(testUpdate);
    });
    describe("Dashboard", function () {
        before(function () {
            cy.visit("/dashboard");
        });
        it("Has no detectable accessibility issues", function () {
            cy.injectAxe();
            cy.checkA11y();
        });
        it("Has no links to admin areas", function () {
            cy.get("a[href*='/admin']")
                .should("not.exist");
        });
    });
    it("Redirects to Dashboard when attempting to access admin area", function () {
        cy.visit("/admin/cleanup");
        cy.location("pathname").should("equal", "/dashboard");
    });
});

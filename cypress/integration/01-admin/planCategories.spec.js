import { v4 as uuidV4 } from "uuid";
import { testAdmin } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Admin - Licence Categories", function () {
    before(function () {
        logout();
        login(testAdmin);
    });
    beforeEach("Loads page", function () {
        cy.visit("/admin/licenceCategories");
        cy.location("pathname").should("equal", "/admin/licenceCategories");
    });
    it("Has no detectable accessibility issues", function () {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Adds a New Licence Category", function () {
        cy.get("button[data-cy='add-licence-category']").click();
        var licenceCategory = uuidV4().slice(-10);
        cy.get(".modal").should("be.visible");
        cy.get(".modal .modal-card-title")
            .should("contain.text", "Add")
            .should("not.contain.text", "Update");
        cy.get(".modal input[name='licenceCategory']")
            .should("be.focused")
            .type(licenceCategory);
        cy.get(".modal form").submit();
        cy.wait(500);
        cy.get(".modal").should("be.visible");
        cy.get(".modal .modal-card-title")
            .should("contain.text", "Update")
            .should("not.contain.text", "Add");
        cy.get(".modal input[name='licenceCategory']")
            .should("contain.value", licenceCategory);
        cy.get(".modal .is-close-modal-button")
            .first()
            .click();
        cy.get(".modal").should("not.exist");
        cy.get("[data-cy='results']")
            .should("contain.text", licenceCategory);
    });
    describe("Updates an Existing Licence Category", function () {
        beforeEach(function () {
            cy.wait(500);
            cy.get("[data-cy='results'] a.panel-block").first().click();
            cy.get(".modal").should("be.visible");
            cy.get(".modal .modal-card-title")
                .should("contain.text", "Update");
            cy.get(".modal input[name='licenceCategory']")
                .should("be.focused");
        });
        afterEach(function () {
            cy.get(".modal .is-close-modal-button")
                .first()
                .click();
            cy.get(".modal").should("not.exist");
        });
        it("Updates Main Details", function () {
            var licenceCategory = uuidV4().slice(-10);
            cy.get(".modal input[name='licenceCategory']")
                .clear()
                .clear()
                .type(licenceCategory);
            cy.get(".modal select[name='printEJS']")
                .select("default");
            cy.get(".modal #form--licenceCategoryEdit").submit();
            cy.wait(500);
            cy.get(".modal").last()
                .should("contain.text", "successful")
                .find("button")
                .click();
        });
        it("Adds an Additional Field", function () {
            var licenceField = uuidV4().slice(-10);
            cy.get(".modal #licenceCategoryFieldAdd--licenceField")
                .focus()
                .type(licenceField)
                .parents("form")
                .submit();
            cy.wait(500);
            cy.get(".modal .modal-card-head")
                .last()
                .should("contain.text", "Update Field");
            cy.get(".modal .is-close-modal-button")
                .last()
                .click();
            cy.get(".modal #container--licenceCategoryFields")
                .should("contain.text", licenceField);
        });
        it.skip("Updates an Additional Field", function () {
        });
        it.skip("Adds an Approval", function () {
        });
        it.skip("Adds a Fee", function () {
        });
    });
});

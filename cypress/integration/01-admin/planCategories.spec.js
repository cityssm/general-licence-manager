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
        it("Has no detectable accessibility issues", function () {
            cy.injectAxe();
            cy.checkA11y();
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
        it("Updates an Additional Field", function () {
            cy.get(".modal #container--licenceCategoryFields a.panel-block")
                .first()
                .click();
            cy.wait(500);
            cy.get(".modal")
                .should("have.length", 2)
                .last()
                .should("contain.text", "Field");
            cy.injectAxe();
            cy.checkA11y();
            cy.get(".modal").last()
                .find("textarea[name='licenceFieldDescription']")
                .focus()
                .clear()
                .clear()
                .type(uuidV4());
            cy.get(".modal").last().find("form").submit();
            cy.wait(500);
            cy.get(".modal").should("have.length", 1);
        });
        it("Adds an Approval", function () {
            var licenceApproval = uuidV4().slice(-10);
            cy.get(".modal #licenceCategoryApprovalAdd--licenceApproval")
                .focus()
                .type(licenceApproval)
                .parents("form")
                .submit();
            cy.wait(500);
            cy.get(".modal .modal-card-head")
                .last()
                .should("contain.text", "Update Approval");
            cy.get(".modal .is-close-modal-button")
                .last()
                .click();
            cy.get(".modal #container--licenceCategoryApprovals")
                .should("contain.text", licenceApproval);
        });
        it("Updates an Approval", function () {
            cy.get(".modal #container--licenceCategoryApprovals a.panel-block")
                .first()
                .click();
            cy.wait(500);
            cy.injectAxe();
            cy.checkA11y();
            cy.get(".modal")
                .should("have.length", 2)
                .last()
                .should("contain.text", "Approval");
            cy.get(".modal").last()
                .find("textarea[name='licenceApprovalDescription']")
                .focus()
                .clear()
                .clear()
                .type(uuidV4());
            cy.get(".modal").last().find("form").submit();
            cy.wait(500);
            cy.get(".modal").should("have.length", 1);
        });
        it("Adds a Fee", function () {
            var currentYear = new Date().getFullYear();
            cy.get(".modal .is-add-fee-button")
                .click();
            cy.wait(500);
            cy.get(".modal")
                .should("have.length", 2)
                .last()
                .should("contain.text", "Fee");
            cy.injectAxe();
            cy.checkA11y();
            cy.get(".modal input[name='effectiveStartDateString']")
                .invoke("val", currentYear.toString() + "-01-01");
            cy.get(".modal input[name='effectiveEndDateString']")
                .invoke("val", currentYear.toString() + "-12-31");
            cy.get(".modal input[name='licenceFee']")
                .clear()
                .clear()
                .type("100");
            cy.get(".modal").last()
                .find("form")
                .submit();
            cy.wait(500);
            cy.get(".modal")
                .should("have.length", 1);
        });
    });
});
import { v4 as uuidV4 } from "uuid";
import { testAdmin } from "../../../test/_globals.js";
import { logout, login, ajaxDelayMillis } from "../../support/index.js";
describe("Admin - Licence Categories", () => {
    beforeEach('Loads Page', () => {
        logout();
        login(testAdmin);
        cy.visit("/admin/licenceCategories");
        cy.location("pathname").should("equal", "/admin/licenceCategories");
    });
    afterEach(logout);
    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Adds a New Licence Category", () => {
        cy.get("button[data-cy='add-licence-category']").click();
        const licenceCategory = uuidV4().slice(-10);
        cy.get(".modal").should("be.visible");
        cy.get(".modal .modal-card-title")
            .should("contain.text", "Add")
            .should("not.contain.text", "Update");
        cy.get(".modal input[name='licenceCategory']")
            .should("be.focused")
            .type(licenceCategory);
        cy.get(".modal form").submit();
        cy.wait(ajaxDelayMillis);
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
    describe("Updates an Existing Licence Category", () => {
        beforeEach(() => {
            cy.wait(ajaxDelayMillis);
            cy.get("[data-cy='results'] a.panel-block").first().click();
            cy.get(".modal").should("be.visible");
            cy.get(".modal .modal-card-title")
                .should("contain.text", "Update");
            cy.get(".modal input[name='licenceCategory']")
                .should("be.focused");
        });
        afterEach(() => {
            cy.get(".modal .is-close-modal-button")
                .first()
                .click();
            cy.get(".modal").should("not.exist");
        });
        it("Has no detectable accessibility issues", () => {
            cy.injectAxe();
            cy.checkA11y();
        });
        it("Updates Main Details", () => {
            const licenceCategory = uuidV4().slice(-10);
            cy.get(".modal input[name='licenceCategory']")
                .clear()
                .clear()
                .type(licenceCategory);
            cy.get(".modal select[name='printEJS']")
                .select("default");
            cy.get(".modal #form--licenceCategoryEdit").submit();
            cy.wait(ajaxDelayMillis);
            cy.get(".modal").last()
                .should("contain.text", "successful")
                .find("button")
                .click();
        });
        it("Adds an Additional Field", () => {
            const licenceField = uuidV4().slice(-10);
            cy.get(".modal #licenceCategoryFieldAdd--licenceField")
                .focus()
                .type(licenceField)
                .parents("form")
                .submit();
            cy.wait(1000);
            cy.get(".modal .modal-card-head")
                .last()
                .should("contain.text", "Update Field");
            cy.get(".modal .is-close-modal-button")
                .last()
                .click();
            cy.get(".modal #container--licenceCategoryFields")
                .should("contain.text", licenceField);
        });
        it("Updates an Additional Field", () => {
            cy.get(".modal #container--licenceCategoryFields a.panel-block")
                .first()
                .click();
            cy.wait(ajaxDelayMillis);
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
            cy.wait(ajaxDelayMillis);
            cy.get(".modal").should("have.length", 1);
        });
        it("Adds an Approval", () => {
            const licenceApproval = uuidV4().slice(-10);
            cy.get(".modal #licenceCategoryApprovalAdd--licenceApproval")
                .focus()
                .type(licenceApproval)
                .parents("form")
                .submit();
            cy.wait(ajaxDelayMillis);
            cy.get(".modal .modal-card-head")
                .last()
                .should("contain.text", "Update Approval");
            cy.get(".modal .is-close-modal-button")
                .last()
                .click();
            cy.get(".modal #container--licenceCategoryApprovals")
                .should("contain.text", licenceApproval);
        });
        it("Updates an Approval", () => {
            cy.get(".modal #container--licenceCategoryApprovals a.panel-block")
                .first()
                .click();
            cy.wait(ajaxDelayMillis);
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
            cy.wait(ajaxDelayMillis);
            cy.get(".modal").should("have.length", 1);
        });
        it("Adds a Fee", () => {
            const currentYear = new Date().getFullYear();
            cy.get(".modal .is-add-fee-button")
                .click();
            cy.wait(ajaxDelayMillis);
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
            cy.wait(ajaxDelayMillis);
            cy.get(".modal")
                .should("have.length", 1);
        });
        it("Adds an Additional Fee", () => {
            const additionalFee = uuidV4().slice(-10);
            cy.get(".modal #licenceCategoryAdditionalFeeAdd--additionalFee")
                .focus()
                .type(additionalFee)
                .parents("form")
                .submit();
            cy.wait(1000);
            cy.get(".modal .modal-card-head")
                .last()
                .should("contain.text", "Update Additional Fee");
            cy.get(".modal .is-close-modal-button")
                .last()
                .click();
            cy.get(".modal #container--licenceCategoryAdditionalFees")
                .should("contain.text", additionalFee);
        });
        it("Updates an Additional Fee", () => {
            cy.get(".modal #container--licenceCategoryAdditionalFees a.panel-block")
                .first()
                .click();
            cy.wait(ajaxDelayMillis);
            cy.get(".modal")
                .should("have.length", 2)
                .last()
                .should("contain.text", "Additional Fee");
            cy.injectAxe();
            cy.checkA11y();
            cy.get(".modal").last()
                .find("select[name='additionalFeeType']")
                .focus()
                .select("percent");
            cy.get(".modal").last()
                .find("input[name='additionalFeeNumber']")
                .focus()
                .clear()
                .clear()
                .type("13");
            cy.get(".modal").last().find("form").submit();
            cy.wait(ajaxDelayMillis);
            cy.get(".modal").should("have.length", 1);
        });
    });
});

import * as configFunctions from "../../../helpers/functions.config.js";
import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
import { testUpdate } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Update - Licences", function () {
    before(function () {
        logout();
        login(testUpdate);
    });
    it("Has a \"Create\" link on the dashboard", function () {
        cy.visit("/dashboard");
        cy.get("a[href$='/licences/new']").should("exist");
    });
    it("Has a \"Create\" link on the Licence Search", function () {
        cy.visit("/licences");
        cy.get("a[href$='/licences/new']").should("exist");
    });
    describe("Create a New Licence", function () {
        before(function () {
            cy.visit("/licences/new");
        });
        it("Has no detectable accessibility issues", function () {
            cy.injectAxe();
            cy.checkA11y();
        });
        it("Can select a licence category", function () {
            cy.get("select[name='licenceCategoryKey']")
                .select(0);
            cy.get("input[name='licenceFee']")
                .should("have.value", "");
            cy.get("input[name='replacementFee']")
                .should("have.value", "");
            cy.get("select[name='licenceCategoryKey'] option")
                .should("have.lengthOf.gt", 1);
            cy.get("select[name='licenceCategoryKey']")
                .select(1);
            cy.get("input[name='licenceFee']")
                .should("not.have.value", "");
            cy.get("input[name='replacementFee']")
                .should("not.have.value", "");
        });
        it("Can unlock the licence number field", function () {
            cy.get("input[name='licenceNumber']")
                .should("have.attr", "readonly");
            cy.get("input[name='licenceNumber']")
                .closest(".field")
                .find("button.is-unlock-button")
                .click();
            cy.get("input[name='licenceNumber']")
                .should("be.focused")
                .should("not.have.attr", "readonly");
        });
        it("Can populate basic details", function () {
            cy.fixture("licence.json").then(function (licenceJSON) {
                cy.get("input[name='licenseeName']")
                    .clear()
                    .type(licenceJSON.licenseeName);
                cy.get("input[name='licenseeBusinessName']")
                    .clear()
                    .type(licenceJSON.licenseeBusinessName);
                cy.get("input[name='licenseeAddress1']")
                    .clear()
                    .type(licenceJSON.licenseeAddress1);
                cy.get("input[name='licenseePostalCode']")
                    .clear()
                    .type(licenceJSON.licenseePostalCode);
                cy.get("input[name='bankInstitutionNumber']")
                    .clear()
                    .type(licenceJSON.bankInstitutionNumber);
                cy.get("input[name='bankTransitNumber']")
                    .clear()
                    .type(licenceJSON.bankTransitNumber);
                cy.get("input[name='bankAccountNumber']")
                    .clear()
                    .type(licenceJSON.bankAccountNumber);
                cy.wait(500);
                cy.get("#licenceEdit--bankName")
                    .should("have.value", getCanadianBankName(licenceJSON.bankInstitutionNumber, licenceJSON.bankTransitNumber));
            });
        });
        it("Should use the default licensee city and province", function () {
            cy.get("input[name='licenseeCity']")
                .should("have.value", configFunctions.getProperty("defaults.licenseeCity"));
            cy.get("input[name='licenseeProvince']")
                .should("have.value", configFunctions.getProperty("defaults.licenseeProvince"));
        });
        it("Should populate custom fields", function () {
            cy.get("input[name^='field--']").each(function ($fieldElement, index) {
                $fieldElement.val("Field " + index);
            });
        });
        it("Should check custom approvals", function () {
            cy.get("input[name^='approval--']").each(function ($approvalElement) {
                $approvalElement.prop("checked", true);
            });
        });
        it("Should submit form and create the licence", function () {
            cy.get("#form--licenceEdit").submit();
            cy.wait(500);
            cy.location("pathname")
                .should("not.contain", "/new")
                .should("contain", "/edit");
        });
    });
    describe.only("Update a Licence", function () {
        before(function () {
            cy.visit("/licences");
            cy.wait(500);
            cy.get("#container--searchResults a")
                .first()
                .click();
            cy.wait(500);
            cy.get("a[href$='/edit']")
                .first()
                .click();
            cy.wait(500);
        });
        it("Can add a transaction", function () {
            cy.get("#button--addTransaction")
                .click();
        });
    });
});

/* eslint-disable unicorn/filename-case, promise/catch-or-return, promise/always-return */

import * as configFunctions from "../../../helpers/functions.config.js";
import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";

import { testUpdate } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";


describe("Update - Licences", () => {

  before(() => {
    logout();
    login(testUpdate)
  });

  // after(logout);

  it("Has a \"Create\" link on the dashboard", () => {
    cy.visit("/dashboard");
    cy.get("a[href$='/licences/new']").should("exist");
  });

  it("Has a \"Create\" link on the Licence Search", () => {
    cy.visit("/licences");
    cy.get("a[href$='/licences/new']").should("exist");
  });

  it("Can create a new licence", () => {

    cy.visit("/licences/new");

    cy.injectAxe();
    cy.checkA11y();

    // Licence Category

    cy.get("select[name='licenceCategoryKey'] option")
      .should("have.lengthOf.gt", 1);

    cy.get("select[name='licenceCategoryKey']")
      .select(1);

    // Licence Number

    cy.get("input[name='licenceNumber']")
      .should("have.attr", "readonly");

    cy.get("input[name='licenceNumber']")
      .closest(".field")
      .find("button.is-unlock-button")
      .click();

    cy.get("input[name='licenceNumber']")
      .should("be.focused")
      .should("not.have.attr", "readonly");

    // Licensee Details

    cy.fixture("licence.json").then((licenceJSON) => {

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

    cy.get("input[name='licenseeCity']")
      .should("have.value", configFunctions.getProperty("defaults.licenseeCity"));

    cy.get("input[name='licenseeProvince']")
      .should("have.value", configFunctions.getProperty("defaults.licenseeProvince"));

    cy.get("input[name^='field--']").each(($fieldElement, index) => {
      $fieldElement.val("Field " + index);
    });

    cy.get("input[name^='approval--']").each(($approvalElement) => {
      $approvalElement.prop("checked", true);
    });

    cy.get("#form--licenceEdit").submit();

    cy.wait(500);

    cy.location("pathname")
      .should("not.contain", "/new")
      .should("contain", "/edit");
  });

  it("Can update and existing licences", () => {

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
});

import { testView } from "../../../test/_globals.js";

import { logout, login, ajaxDelayMillis } from "../../support/index.js";


describe("Reports", () => {
  before(() => {
    logout();
    login(testView);
    cy.visit("/reports");
  });

  after(logout);

  it("Loads page", () => {
    cy.location("pathname").should("equal", "/reports");
  });

  it("Has no detectable accessibility issues", () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it("Exports all reports", () => {

    cy.get("a[download][href*='/reports/']").each(($reportLink) => {
      cy.wrap($reportLink).click();
      cy.wait(ajaxDelayMillis);

    });
  });
});

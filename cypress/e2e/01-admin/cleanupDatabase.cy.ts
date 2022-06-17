/* eslint-disable unicorn/filename-case, promise/catch-or-return, promise/always-return */

import { testAdmin } from "../../../test/_globals.js";

import { logout, login, ajaxDelayMillis } from "../../support/index.js";


describe("Admin - Cleanup Database", () => {

  before(() => {
    logout();
    login(testAdmin)
  });

  after(logout);

  beforeEach("Loads page", () => {
    cy.visit("/admin/cleanup");
    cy.location("pathname").should("equal", "/admin/cleanup");
  });

  it("Has no detectable accessibility issues", () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it("Backs up the database", () => {

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
  });

  it("Cleans up the database", () => {

    cy.get("a[data-cy='cleanup']").click();

    cy.get(".modal")
      .should("be.visible")
      .should("contain.text", "Cleanup");

    cy.get(".modal button[data-cy='ok']")
      .click();

    cy.wait(ajaxDelayMillis);

    cy.get(".modal")
      .should("contain.text", "Cleaned Up")
      .should("contain.text", "Success");

    cy.get(".modal button[data-cy='ok']")
      .click();
  });
});

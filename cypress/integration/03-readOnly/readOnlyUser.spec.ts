import { testView } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";


describe("Read Only User", () => {

  before(logout);

  after(logout);

  it("Logs In Successfully", () => {
    login(testView);
  });

  describe("Dashboard", () => {
    before(() => {
      cy.visit("/dashboard");
    });

    it("Has no detectable accessibility issues", () => {
      cy.injectAxe();
      cy.checkA11y();
    });

    it("Has no links to new licences", () => {
      cy.get("a[href*='/new']")
        .should("not.exist");
    });

    it("Has no links to admin areas", () => {
      cy.get("a[href*='/admin']")
        .should("not.exist");
    });
  });

  describe("Licence Search", () => {
    before(() => {
      cy.visit("/licences");
    });

    it("Loads page", () => {
      cy.location("pathname").should("equal", "/licences");
    });

    it("Has no links to new licence", () => {
      cy.get("a[href*='/new']")
        .should("not.exist");
    });
  });

  describe("Create a Licence", () => {
    it("Redirects to Dashboard", () => {
      cy.visit("/licences/new")
      cy.location("pathname").should("equal", "/dashboard");
    });
  });

  describe("Reports", () => {
    before(() => {
      cy.visit("/reports");
    });

    it("Loads page", () => {
      cy.location("pathname").should("equal", "/reports");
    });

    it("Has no detectable accessibility issues", () => {
      cy.injectAxe();
      cy.checkA11y();
    });
  });

  describe("Admin - Licence Categories", () => {

    it("Redirects to Dashboard", () => {
      cy.visit("/admin/licenceCategories");
      cy.location("pathname").should("not.contain", "/admin");
    });
  });
});

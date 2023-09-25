import { testView } from '../../../test/_globals.js'

import { logout, login, ajaxDelayMillis } from '../../support/index.js'

describe('Reports', () => {
  beforeEach(() => {
    logout()
    login(testView)
    cy.visit('/reports')
  })

  afterEach(logout)

  it('Loads page', () => {
    cy.location('pathname').should('equal', '/reports')

    // Makes all reports visible

    const hiddenReportsSelector = "a.is-hidden[download][href*='/reports/']"

    cy.get(hiddenReportsSelector).should('exist')

    cy.get("button[data-cy='panel-toggle']").each(($toggleButton) => {
      cy.wrap($toggleButton).click()
    })

    cy.get(hiddenReportsSelector).should('not.exist')

    // Has no detectable accessibility issues
    cy.injectAxe()
    cy.checkA11y()

    // Exports all reports without parameters

    cy.get("a:not(.is-hidden)[download][href*='/reports/']").each(
      ($reportLink) => {
        cy.wrap($reportLink).click()
        cy.wait(ajaxDelayMillis)
      }
    )

    // Exports all reports with parameters

    cy.get("form[action*='/reports/']").each(($reportLink) => {
      cy.wrap($reportLink).invoke('attr', 'target', '_blank').submit()
      cy.wait(ajaxDelayMillis)
    })
  })
})

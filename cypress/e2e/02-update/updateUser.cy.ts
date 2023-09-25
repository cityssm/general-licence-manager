import { testUpdate } from '../../../test/_globals.js'

import { logout, login } from '../../support/index.js'

describe('Update User', () => {
  beforeEach(() => {
    logout()
    login(testUpdate)
  })

  afterEach(logout)

  describe('Dashboard', () => {
    before(() => {
      cy.visit('/dashboard')
    })

    it('Has no detectable accessibility issues', () => {
      cy.injectAxe()
      cy.checkA11y()
    })

    it('Has no links to admin areas', () => {
      cy.get("a[href*='/admin']").should('not.exist')
    })
  })

  it('Redirects to Dashboard when attempting to access admin area', () => {
    cy.visit('/admin/cleanup')
    cy.location('pathname').should('equal', '/dashboard')
  })
})

import { testView } from '../../../test/_globals.js'

import { logout, login, ajaxDelayMillis } from '../../support/index.js'

describe('Licence Search', () => {
  beforeEach(() => {
    logout()
    login(testView)
    cy.visit('/licences')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.wait(ajaxDelayMillis)
    cy.injectAxe()
    cy.checkA11y()
  })
})

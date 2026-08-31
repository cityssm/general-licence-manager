import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:7000',
    projectId: 'm93ucs',
    specPattern: 'cypress/e2e/**/*.cy.js',

    supportFile: false
  }
})

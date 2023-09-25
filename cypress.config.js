import { defineConfig } from 'cypress';
export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:7000',
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: false,
        projectId: 'm93ucs'
    }
});

import * as configFunctions from '../../../helpers/functions.config.js';
import { getCanadianBankName } from '@cityssm/get-canadian-bank-name';
import { testUpdate } from '../../../test/_globals.js';
import { logout, login, ajaxDelayMillis } from '../../support/index.js';
describe('Update - Licences', () => {
    beforeEach(() => {
        logout();
        login(testUpdate);
    });
    afterEach(logout);
    it('Has a "Create" link on the dashboard', () => {
        cy.visit('/dashboard');
        cy.get("a[href$='/licences/new']").should('exist');
    });
    it('Has a "Create" link on the Licence Search', () => {
        cy.visit('/licences');
        cy.get("a[href$='/licences/new']").should('exist');
    });
    it('Can Create a New Licence', () => {
        cy.visit('/licences/new');
        cy.injectAxe();
        cy.checkA11y();
        cy.get("select[name='licenceCategoryKey']").select(0);
        cy.get("input[name='baseLicenceFee']").should('have.value', '');
        if (configFunctions.getConfigProperty('settings.includeReplacementFee')) {
            cy.get("input[name='baseReplacementFee']").should('have.value', '');
        }
        cy.get("select[name='licenceCategoryKey'] option").should('have.lengthOf.gt', 1);
        cy.get("select[name='licenceCategoryKey']").select(1);
        cy.get("input[name='baseLicenceFee']").should('not.have.value', '');
        if (configFunctions.getConfigProperty('settings.includeReplacementFee')) {
            cy.get("input[name='baseReplacementFee']").should('not.have.value', '');
        }
        cy.get("input[name='licenceNumber']").should('have.attr', 'readonly');
        cy.get("input[name='licenceNumber']")
            .closest('.field')
            .find('button.is-unlock-button')
            .click();
        cy.get("input[name='licenceNumber']")
            .should('be.focused')
            .should('not.have.attr', 'readonly');
        cy.fixture('licence.json').then((licenceJSON) => {
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
                .invoke('attr', 'type')
                .then((attributeType) => {
                if (attributeType !== 'hidden') {
                    cy.get("input[name='bankInstitutionNumber']")
                        .clear()
                        .type(licenceJSON.bankInstitutionNumber);
                    cy.get("input[name='bankTransitNumber']")
                        .clear()
                        .type(licenceJSON.bankTransitNumber);
                    cy.get("input[name='bankAccountNumber']")
                        .clear()
                        .type(licenceJSON.bankAccountNumber);
                    cy.wait(ajaxDelayMillis);
                    cy.get('#licenceEdit--bankName').should('have.value', getCanadianBankName(licenceJSON.bankInstitutionNumber, licenceJSON.bankTransitNumber));
                }
            });
        });
        cy.get("input[name='licenseeCity']").should('have.value', configFunctions.getConfigProperty('defaults.licenseeCity'));
        cy.get("input[name='licenseeProvince']").should('have.value', configFunctions.getConfigProperty('defaults.licenseeProvince'));
        cy.get("input[name^='field--']").each(($fieldElement, index) => {
            $fieldElement.val('Field ' + index);
        });
        cy.get("input[name^='approval--']").each(($approvalElement) => {
            $approvalElement.prop('checked', true);
        });
        cy.get('#form--licenceEdit').submit();
        cy.wait(ajaxDelayMillis);
        cy.location('pathname')
            .should('not.contain', '/new')
            .should('contain', '/edit');
    });
    it('Updates a Licence', () => {
        cy.visit('/licences');
        cy.wait(ajaxDelayMillis);
        cy.get("#container--searchResults tr[data-cy='pending'] a").first().click();
        cy.wait(ajaxDelayMillis);
        cy.get("a[href$='/edit']").first().click();
        cy.wait(ajaxDelayMillis);
        cy.get('#form--licenceEdit').submit();
        cy.get('.modal').should('contain.text', 'Updated Successfully');
        cy.get('.modal button').click();
        cy.get('#button--addTransaction').click();
        cy.get('.modal').should('exist');
        cy.injectAxe();
        cy.checkA11y();
        cy.get(".modal input[name='bankInstitutionNumber']").should('not.be.visible');
        cy.get('.modal .is-more-fields-button').click();
        cy.get('.modal .is-more-fields-button').should('not.exist');
        cy.injectAxe();
        cy.checkA11y();
        cy.get('.modal .is-copy-bank-numbers-button').then(($copyBankButton) => {
            if (!$copyBankButton.hasClass('is-hidden')) {
                cy.get(".modal input[name='bankInstitutionNumber']")
                    .should('be.visible')
                    .should('have.value', '');
                cy.wrap($copyBankButton).click();
                cy.get(".modal input[name='bankInstitutionNumber']").should('not.have.value', '');
            }
        });
        cy.get('.modal form').submit();
        cy.wait(ajaxDelayMillis);
        cy.get('#table--licenceTransactions tbody tr').should('have.lengthOf.gt', 0);
        cy.get('#is-issue-licence-button').click();
        cy.get(".modal button[data-cy='ok']").click();
        cy.wait(ajaxDelayMillis);
        cy.get('#is-issue-licence-button').should('not.exist');
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const debounce = (functionToDebounce, wait, immediate) => {
        let timeout;
        return function (...arguments_) {
            const debounceContext = this;
            const debounceArguments = arguments_;
            const later = () => {
                timeout = undefined;
                if (!immediate)
                    functionToDebounce.apply(debounceContext, debounceArguments);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                functionToDebounce.apply(debounceContext, debounceArguments);
        };
    };
    const urlPrefix = document.querySelector('main').dataset.urlPrefix;
    const licenceAlias = exports.licenceAlias;
    const licenseeAlias = exports.licenseeAlias;
    const startDateStringMinElement = document.querySelector('#filter--startDateStringMin');
    const startDateStringMaxElement = document.querySelector('#filter--startDateStringMax');
    startDateStringMinElement.addEventListener('change', () => {
        if (startDateStringMaxElement.value < startDateStringMinElement.value) {
            startDateStringMaxElement.value = startDateStringMinElement.value;
        }
        startDateStringMaxElement.min = startDateStringMinElement.value;
    });
    const filterFormElement = document.querySelector('#form--filters');
    const resultsElement = document.querySelector('#container--licenceCategorySummary');
    const getLicenceCategorySummary = () => {
        resultsElement.innerHTML =
            '<p class="has-text-centered has-text-grey-lighter">' +
                '<i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
                '<em>Loading records...</em><br />' +
                'Please be patient with larger start date ranges.' +
                '</p>';
        cityssm.postJSON(urlPrefix + '/licences/doGetLicenceCategorySummary', filterFormElement, (responseJSON) => {
            try {
                if (responseJSON.licences.length === 0) {
                    resultsElement.innerHTML =
                        '<div class="message is-info">' +
                            '<p class="message-body">There are no records that meet the report criteria.</p>' +
                            '</div>';
                    return;
                }
                const licenceTableBodyElements = new Map();
                const summaryData = new Map();
                for (const licence of responseJSON.licences) {
                    const licenceTransactionSum = licence.licenceTransactions.reduce((previousValue, currentTransaction) => {
                        return previousValue + currentTransaction.transactionAmount;
                    }, 0);
                    const licenceRowElement = document.createElement('tr');
                    licenceRowElement.innerHTML =
                        '<td>' +
                            '<a href="' +
                            urlPrefix +
                            '/licences/' +
                            licence.licenceId +
                            '">' +
                            cityssm.escapeHTML(licence.licenceNumber) +
                            '</a>' +
                            '</td>' +
                            ('<td>' +
                                cityssm.escapeHTML(licence.licenseeName) +
                                '<br />' +
                                (licence.licenseeBusinessName === ''
                                    ? ''
                                    : cityssm.escapeHTML(licence.licenseeBusinessName) +
                                        '<br />') +
                                cityssm.escapeHTML(licence.licenseeAddress1) +
                                '<br />' +
                                (licence.licenseeAddress2 === ''
                                    ? ''
                                    : cityssm.escapeHTML(licence.licenseeAddress2) + '<br />') +
                                cityssm.escapeHTML(licence.licenseeCity) +
                                ', ' +
                                cityssm.escapeHTML(licence.licenseeProvince) +
                                '<br />' +
                                cityssm.escapeHTML(licence.licenseePostalCode) +
                                '</td>') +
                            '<td class="has-text-right">$' +
                            licenceTransactionSum.toFixed(2) +
                            '</td>';
                    if (!licenceTableBodyElements.has(licence.licenceCategoryKey)) {
                        licenceTableBodyElements.set(licence.licenceCategoryKey, document.createElement('tbody'));
                        licenceTableBodyElements.get(licence.licenceCategoryKey).innerHTML =
                            '<tr class="is-selected">' +
                                '<th colspan="3">' +
                                cityssm.escapeHTML(licence.licenceCategory) +
                                '</th>' +
                                '</tr>';
                    }
                    licenceTableBodyElements
                        .get(licence.licenceCategoryKey)
                        .append(licenceRowElement);
                    if (!summaryData.has(licence.licenceCategoryKey)) {
                        summaryData.set(licence.licenceCategoryKey, {
                            licenceCategoryKey: licence.licenceCategoryKey,
                            licenceCategory: licence.licenceCategory,
                            licenceCount: 0,
                            transactionAmountSum: 0
                        });
                    }
                    const licenceCategorySummary = summaryData.get(licence.licenceCategoryKey);
                    licenceCategorySummary.licenceCount += 1;
                    licenceCategorySummary.transactionAmountSum += licenceTransactionSum;
                }
                const summaryDataList = [...summaryData.values()];
                summaryDataList.sort((dataA, dataB) => {
                    if (dataA.licenceCategory > dataB.licenceCategory) {
                        return 1;
                    }
                    return 0;
                });
                const licenceTableElement = document.createElement('table');
                licenceTableElement.className =
                    'table is-striped is-hoverable is-fullwidth has-sticky-header';
                licenceTableElement.innerHTML =
                    '<thead><tr>' +
                        '<th>' +
                        licenceAlias +
                        ' Number</th>' +
                        '<th>' +
                        licenseeAlias +
                        '</th>' +
                        '<th class="has-text-right">Transaction</th>' +
                        '</tr></thead>';
                let totalTransactionAmountSum = 0;
                const summaryTableElement = document.createElement('table');
                summaryTableElement.className =
                    'table is-striped is-hoverable is-fullwidth has-sticky-header';
                summaryTableElement.innerHTML =
                    '<thead><tr>' +
                        '<th>' +
                        licenceAlias +
                        ' Category</th>' +
                        '<th class="has-text-right">Count</th>' +
                        '<th class="has-text-right">Transactions</th>' +
                        '</tr></thead>' +
                        '<tbody></tbody>' +
                        '<tfoot><th>Total</th></tfoot>';
                for (const data of summaryDataList) {
                    licenceTableElement.append(licenceTableBodyElements.get(data.licenceCategoryKey));
                    const dataRowElement = document.createElement('tr');
                    dataRowElement.innerHTML =
                        '<td>' +
                            cityssm.escapeHTML(data.licenceCategory) +
                            '</td>' +
                            '<td class="has-text-right">' +
                            data.licenceCount +
                            '</td>' +
                            '<td class="has-text-right">$' +
                            data.transactionAmountSum.toFixed(2) +
                            '</td>';
                    summaryTableElement.querySelector('tbody').append(dataRowElement);
                    totalTransactionAmountSum += data.transactionAmountSum;
                }
                summaryTableElement
                    .querySelector('tfoot tr')
                    .insertAdjacentHTML('beforeend', '<td class="has-text-right">' +
                    responseJSON.licences.length +
                    '</td>' +
                    '<td class="has-text-right">$' +
                    totalTransactionAmountSum.toFixed(2) +
                    '</td>');
                resultsElement.innerHTML = '';
                resultsElement.append(summaryTableElement);
                resultsElement.append(licenceTableElement);
            }
            catch (error) {
                console.log(error);
            }
        });
    };
    filterFormElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
    });
    getLicenceCategorySummary();
    const debounceFunction_getLicenceCategorySummary = debounce(getLicenceCategorySummary, 200);
    startDateStringMinElement.addEventListener('change', debounceFunction_getLicenceCategorySummary);
    startDateStringMaxElement.addEventListener('change', debounceFunction_getLicenceCategorySummary);
    document
        .querySelector('#filter--licenceCategoryKey')
        .addEventListener('change', getLicenceCategorySummary);
})();

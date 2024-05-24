"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const licenceAlias = exports.licenceAlias;
    const licenceAliasPlural = exports.licenceAliasPlural;
    const licenseeAlias = exports.licenseeAlias;
    const formElement = document.querySelector('#form--filters');
    const limitElement = document.querySelector('#filter--limit');
    const offsetElement = document.querySelector('#filter--offset');
    const searchResultsElement = document.querySelector('#container--searchResults');
    function doLicenceSearchFunction() {
        const currentLimit = Number.parseInt(limitElement.value, 10);
        const currentOffset = Number.parseInt(offsetElement.value, 10);
        searchResultsElement.innerHTML = `<p class="has-text-centered has-text-grey">
      <i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />
      <em>Loading records...</em>
      </p>`;
        cityssm.postJSON(`${glm.urlPrefix}/licences/doSearch`, formElement, (rawResponseJSON) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const licenceResults = rawResponseJSON;
            const licenceList = licenceResults.licences;
            if (licenceList.length === 0) {
                searchResultsElement.innerHTML = `<div class="message is-info">
            <div class="message-body">
              <strong>Your search returned no results.</strong><br />
              Please try expanding your search criteria.
            </div>
            </div>`;
                return;
            }
            searchResultsElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
          <thead><tr>
          <th>
          ${cityssm.escapeHTML(licenceAlias)} Number
          </th>
          <th>Category</th>
          <th>${cityssm.escapeHTML(licenseeAlias)}</th>
          <th>Effective</th>
          <th>Fields</th>
          <th aria-label="Issued Status"></th>
          </tr></thead>
          </table>`;
            const tbodyElement = document.createElement('tbody');
            for (const licenceObject of licenceList) {
                const trElement = document.createElement('tr');
                trElement.dataset.cy = licenceObject.issueDate ? 'issued' : 'pending';
                let licenseeHTML = cityssm.escapeHTML(licenceObject.licenseeName);
                if (licenceObject.licenseeBusinessName.trim() !== '') {
                    licenseeHTML = `${cityssm.escapeHTML(licenceObject.licenseeBusinessName)}<br />
              <span class="is-size-7">${licenseeHTML}</span>`;
                }
                let fieldsHTML = '';
                for (const licenceField of (_a = licenceObject.licenceFields) !== null && _a !== void 0 ? _a : []) {
                    if (((_b = licenceField.licenceFieldValue) !== null && _b !== void 0 ? _b : '') !== '') {
                        fieldsHTML += `${cityssm.escapeHTML((_c = licenceField.licenceField) !== null && _c !== void 0 ? _c : '')}: 
                ${cityssm.escapeHTML(licenceField.licenceFieldValue)}<br />`;
                    }
                }
                trElement.innerHTML = `<td>
            <a
              href="${glm.urlPrefix}/licences/${licenceObject.licenceId.toString()}">
            ${cityssm.escapeHTML(licenceObject.licenceNumber)}
            </a><br />
            </td><td>
              ${cityssm.escapeHTML((_d = licenceObject.licenceCategory) !== null && _d !== void 0 ? _d : '')}
            </td><td>
              ${licenseeHTML}
            </td><td>
              <span class="is-nowrap has-tooltip-right" data-tooltip="Start Date" aria-label="Start Date">
              <i class="fas fa-fw fa-play" aria-hidden="true"></i>
              ${cityssm.escapeHTML((_e = licenceObject.startDateString) !== null && _e !== void 0 ? _e : '')}
              </span><br />
              <span class="is-nowrap has-tooltip-right" data-tooltip="End Date" aria-label="End Date">
              <i class="fas fa-fw fa-stop" aria-hidden="true"></i>
              ${cityssm.escapeHTML((_f = licenceObject.endDateString) !== null && _f !== void 0 ? _f : '')}
              </span>
            </td><td>
              <span class="is-size-7">${fieldsHTML}</span>
            </td><td class="has-text-centered">
            ${licenceObject.issueDate
                    ? `<a class="button is-small"
                      href="${glm.urlPrefix}/licences/${licenceObject.licenceId}/print"
                      data-tooltip="Print ${cityssm.escapeHTML(licenceAlias)}"
                      target="_blank" aria-label="Print">
                    <i class="fas fa-print" aria-hidden="true"></i>
                    </a>`
                    : '<span class="tag is-warning">Pending</span>'}
            </td>`;
                tbodyElement.append(trElement);
            }
            (_g = searchResultsElement.querySelector('table')) === null || _g === void 0 ? void 0 : _g.append(tbodyElement);
            searchResultsElement.insertAdjacentHTML('beforeend', `<div class="level is-block-print">
            <div class="level-left has-text-weight-bold">
              Displaying
              ${cityssm.escapeHTML(licenceAliasPlural)}
              ${(currentOffset + 1).toString()}
              to
              ${Math.min(currentLimit + currentOffset, licenceResults.count).toString()}
              of
              ${licenceResults.count.toString()}
              </div>
              </div>`);
            if (currentLimit < licenceResults.count) {
                const paginationElement = document.createElement('nav');
                paginationElement.className = 'level-right is-hidden-print';
                paginationElement.setAttribute('role', 'navigation');
                paginationElement.setAttribute('aria-label', 'pagination');
                if (currentOffset > 0) {
                    const previousElement = document.createElement('button');
                    previousElement.className = 'button';
                    previousElement.textContent = 'Previous';
                    previousElement.type = 'button';
                    previousElement.addEventListener('click', (clickEvent) => {
                        clickEvent.preventDefault();
                        offsetElement.value = Math.max(0, currentOffset - currentLimit).toString();
                        doLicenceSearchFunction();
                    });
                    paginationElement.append(previousElement);
                }
                if (currentLimit + currentOffset < licenceResults.count) {
                    const nextElement = document.createElement('button');
                    nextElement.className = 'button ml-3';
                    nextElement.type = 'button';
                    nextElement.innerHTML = `<span>
              Next ${cityssm.escapeHTML(licenceAliasPlural)}
              </span>
              <span class="icon"><i class="fas fa-chevron-right" aria-hidden="true"></i></span>`;
                    nextElement.addEventListener('click', (clickEvent) => {
                        clickEvent.preventDefault();
                        offsetElement.value = (currentOffset + currentLimit).toString();
                        doLicenceSearchFunction();
                    });
                    paginationElement.append(nextElement);
                }
                (_h = searchResultsElement
                    .querySelector('.level')) === null || _h === void 0 ? void 0 : _h.append(paginationElement);
            }
        });
    }
    function resetOffsetAndDoLicenceSearchFunction() {
        offsetElement.value = '0';
        doLicenceSearchFunction();
    }
    formElement.addEventListener('submit', (formEvent) => {
        formEvent.preventDefault();
    });
    const inputElements = formElement.querySelectorAll('.input, .select select');
    for (const inputElement of inputElements) {
        inputElement.addEventListener('change', resetOffsetAndDoLicenceSearchFunction);
    }
    resetOffsetAndDoLicenceSearchFunction();
})();

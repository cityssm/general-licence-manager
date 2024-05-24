/* eslint-disable unicorn/filename-case, unicorn/prefer-module, eslint-comments/disable-enable-pair */

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

import type { GLM } from '../../types/globalTypes.js'
import type { Licence } from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const glm: GLM
;(() => {
  const licenceAlias = exports.licenceAlias as string
  const licenceAliasPlural = exports.licenceAliasPlural as string
  const licenseeAlias = exports.licenseeAlias as string

  const formElement = document.querySelector(
    '#form--filters'
  ) as HTMLFormElement

  const limitElement = document.querySelector(
    '#filter--limit'
  ) as HTMLInputElement

  const offsetElement = document.querySelector(
    '#filter--offset'
  ) as HTMLInputElement

  const searchResultsElement = document.querySelector(
    '#container--searchResults'
  ) as HTMLElement

  function doLicenceSearchFunction(): void {
    const currentLimit = Number.parseInt(limitElement.value, 10)
    const currentOffset = Number.parseInt(offsetElement.value, 10)

    searchResultsElement.innerHTML = `<p class="has-text-centered has-text-grey">
      <i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />
      <em>Loading records...</em>
      </p>`

    cityssm.postJSON(
      `${glm.urlPrefix}/licences/doSearch`,
      formElement,
      (rawResponseJSON) => {
        const licenceResults = rawResponseJSON as {
          count: number
          licences: Licence[]
        }

        const licenceList = licenceResults.licences

        if (licenceList.length === 0) {
          searchResultsElement.innerHTML = `<div class="message is-info">
            <div class="message-body">
              <strong>Your search returned no results.</strong><br />
              Please try expanding your search criteria.
            </div>
            </div>`

          return
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
          </table>`

        const tbodyElement = document.createElement('tbody')

        for (const licenceObject of licenceList) {
          const trElement = document.createElement('tr')
          trElement.dataset.cy = licenceObject.issueDate ? 'issued' : 'pending'

          let licenseeHTML = cityssm.escapeHTML(licenceObject.licenseeName)

          if (licenceObject.licenseeBusinessName.trim() !== '') {
            licenseeHTML = `${cityssm.escapeHTML(
              licenceObject.licenseeBusinessName
            )}<br />
              <span class="is-size-7">${licenseeHTML}</span>`
          }

          let fieldsHTML = ''

          for (const licenceField of licenceObject.licenceFields ?? []) {
            if ((licenceField.licenceFieldValue ?? '') !== '') {
              fieldsHTML += `${cityssm.escapeHTML(
                licenceField.licenceField ?? ''
              )}: 
                ${cityssm.escapeHTML(licenceField.licenceFieldValue)}<br />`
            }
          }

          // eslint-disable-next-line no-unsanitized/property
          trElement.innerHTML = `<td>
            <a
              href="${
                glm.urlPrefix
              }/licences/${licenceObject.licenceId.toString()}">
            ${cityssm.escapeHTML(licenceObject.licenceNumber)}
            </a><br />
            </td><td>
              ${cityssm.escapeHTML(licenceObject.licenceCategory ?? '')}
            </td><td>
              ${licenseeHTML}
            </td><td>
              <span class="is-nowrap has-tooltip-right" data-tooltip="Start Date" aria-label="Start Date">
              <i class="fas fa-fw fa-play" aria-hidden="true"></i>
              ${cityssm.escapeHTML(licenceObject.startDateString ?? '')}
              </span><br />
              <span class="is-nowrap has-tooltip-right" data-tooltip="End Date" aria-label="End Date">
              <i class="fas fa-fw fa-stop" aria-hidden="true"></i>
              ${cityssm.escapeHTML(licenceObject.endDateString ?? '')}
              </span>
            </td><td>
              <span class="is-size-7">${fieldsHTML}</span>
            </td><td class="has-text-centered">
            ${
              licenceObject.issueDate
                ? `<a class="button is-small"
                      href="${glm.urlPrefix}/licences/${
                    licenceObject.licenceId
                  }/print"
                      data-tooltip="Print ${cityssm.escapeHTML(licenceAlias)}"
                      target="_blank" aria-label="Print">
                    <i class="fas fa-print" aria-hidden="true"></i>
                    </a>`
                : '<span class="tag is-warning">Pending</span>'
            }
            </td>`

          tbodyElement.append(trElement)
        }

        searchResultsElement.querySelector('table')?.append(tbodyElement)

        // eslint-disable-next-line no-unsanitized/method
        searchResultsElement.insertAdjacentHTML(
          'beforeend',
          `<div class="level is-block-print">
            <div class="level-left has-text-weight-bold">
              Displaying
              ${cityssm.escapeHTML(licenceAliasPlural)}
              ${(currentOffset + 1).toString()}
              to
              ${Math.min(
                currentLimit + currentOffset,
                licenceResults.count
              ).toString()}
              of
              ${licenceResults.count.toString()}
              </div>
              </div>`
        )

        if (currentLimit < licenceResults.count) {
          const paginationElement = document.createElement('nav')
          paginationElement.className = 'level-right is-hidden-print'
          paginationElement.setAttribute('role', 'navigation')
          paginationElement.setAttribute('aria-label', 'pagination')

          if (currentOffset > 0) {
            const previousElement = document.createElement('button')
            previousElement.className = 'button'
            previousElement.textContent = 'Previous'
            previousElement.type = 'button'

            previousElement.addEventListener('click', (clickEvent) => {
              clickEvent.preventDefault()
              offsetElement.value = Math.max(
                0,
                currentOffset - currentLimit
              ).toString()
              doLicenceSearchFunction()
            })

            paginationElement.append(previousElement)
          }

          if (currentLimit + currentOffset < licenceResults.count) {
            const nextElement = document.createElement('button')
            nextElement.className = 'button ml-3'
            nextElement.type = 'button'

            nextElement.innerHTML = `<span>
              Next ${cityssm.escapeHTML(licenceAliasPlural)}
              </span>
              <span class="icon"><i class="fas fa-chevron-right" aria-hidden="true"></i></span>`

            nextElement.addEventListener('click', (clickEvent) => {
              clickEvent.preventDefault()
              offsetElement.value = (currentOffset + currentLimit).toString()
              doLicenceSearchFunction()
            })

            paginationElement.append(nextElement)
          }

          searchResultsElement
            .querySelector('.level')
            ?.append(paginationElement)
        }
      }
    )
  }

  function resetOffsetAndDoLicenceSearchFunction(): void {
    offsetElement.value = '0'
    doLicenceSearchFunction()
  }

  formElement.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault()
  })

  const inputElements = formElement.querySelectorAll('.input, .select select')

  for (const inputElement of inputElements) {
    inputElement.addEventListener(
      'change',
      resetOffsetAndDoLicenceSearchFunction
    )
  }

  resetOffsetAndDoLicenceSearchFunction()
})()

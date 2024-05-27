/* eslint-disable unicorn/filename-case, unicorn/prefer-module, @eslint-community/eslint-comments/disable-enable-pair */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { GLM } from '../../types/globalTypes.js'
import type * as recordTypes from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS
declare const glm: GLM
;(() => {
  const includeReplacementFee = exports.includeReplacementFee as boolean

  let licenceCategories: recordTypes.LicenceCategory[] =
    exports.licenceCategories

  const licenceCategoriesContainerElement = document.querySelector(
    '#container--licenceCategories'
  ) as HTMLElement

  const licenceCategorySearchElement = document.querySelector(
    '#searchFilter--licenceCategory'
  ) as HTMLInputElement

  function renderLicenceCategories(): void {
    if (licenceCategories.length === 0) {
      licenceCategoriesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no categories available.</p>
        </div>`

      return
    }

    let displayCount = 0

    const searchStringPieces = licenceCategorySearchElement.value
      .toLowerCase()
      .split(' ')

    const panelElement = document.createElement('div')
    panelElement.className = 'panel'

    for (const licenceCategory of licenceCategories) {
      let displayCategory = true

      for (const searchStringPiece of searchStringPieces) {
        if (
          !licenceCategory.licenceCategory
            .toLowerCase()
            .includes(searchStringPiece)
        ) {
          displayCategory = false
          break
        }
      }

      if (!displayCategory) {
        continue
      }

      displayCount += 1

      const panelBlockElement = document.createElement('a')
      panelBlockElement.className = 'panel-block is-block'
      panelBlockElement.dataset.licenceCategoryKey =
        licenceCategory.licenceCategoryKey
      panelBlockElement.setAttribute('role', 'button')

      // eslint-disable-next-line no-unsanitized/property
      panelBlockElement.innerHTML = `<div class="columns is-multiline is-mobile">
          <div class="column is-6-tablet is-12-mobile">
            <strong>
              ${cityssm.escapeHTML(licenceCategory.licenceCategory)}
            </strong><br />
            <span class="is-size-7">
              ${cityssm.escapeHTML(licenceCategory.bylawNumber)}
            </span>
          </div>
          <div class="column is-6-mobile has-text-centered">
            ${
              licenceCategory.hasEffectiveFee
                ? '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Effective Fee</span>'
                : '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Effective Fee</span>'
            }
          </div>
          <div class="column is-6-mobile has-text-centered">
            ${
              licenceCategory.printEJS === ''
                ? '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Print Template</span>'
                : '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Print Template</span>'
            }
          </div>
        </div>`

      panelBlockElement.addEventListener(
        'click',
        openEditLicenceCategoryModalByClick
      )

      panelElement.append(panelBlockElement)
    }

    if (displayCount > 0) {
      licenceCategoriesContainerElement.innerHTML = ''
      licenceCategoriesContainerElement.append(panelElement)
    } else {
      licenceCategoriesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no categories available that meet the search criteria.</p>
        </div>`
    }
  }

  function getLicenceCategories(): void {
    licenceCategoriesContainerElement.innerHTML = `<p class="has-text-centered has-text-grey-lighter">
      <i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />
      <em>Loading categories...</em>
      </p>`

    cityssm.postJSON(
      `${glm.urlPrefix}/admin/doGetLicenceCategories`,
      {},
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          licenceCategories: recordTypes.LicenceCategory[]
        }
        licenceCategories = responseJSON.licenceCategories
        renderLicenceCategories()
      }
    )
  }

  licenceCategorySearchElement.addEventListener(
    'keyup',
    renderLicenceCategories
  )

  /*
   * Edit Licence Category
   */

  let doRefreshOnClose = false
  let editModalElement: HTMLElement

  // Licence Category Fields

  let licenceCategoryFields: recordTypes.LicenceCategoryField[]

  function openEditLicenceCategoryFieldModal(licenceFieldKey: string): void {
    let editLicenceCategoryFieldModalCloseFunction: () => void

    function updateLicenceCategoryFieldSubmitFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doUpdateLicenceCategoryField`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategoryFields: recordTypes.LicenceCategoryField[]
          }

          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields
            editLicenceCategoryFieldModalCloseFunction()
            renderLicenceCategoryFields()
            doRefreshOnClose = true
          }
        }
      )
    }

    function deleteLicenceCategoryFieldFunction(): void {
      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doDeleteLicenceCategoryField`,
        {
          licenceFieldKey
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: true
            licenceCategoryFields: recordTypes.LicenceCategoryField[]
          }

          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields
            renderLicenceCategoryFields()
            editLicenceCategoryFieldModalCloseFunction()
            doRefreshOnClose = true
          }
        }
      )
    }

    function confirmDeleteLicenceCategoryFieldFunction(
      clickEvent: Event
    ): void {
      clickEvent.preventDefault()

      bulmaJS.confirm({
        title: 'Delete Field',
        message: 'Are you sure you want to delete this field?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete It',
          callbackFunction: deleteLicenceCategoryFieldFunction
        }
      })
    }

    const licenceCategoryField = licenceCategoryFields.find((possibleField) => {
      return possibleField.licenceFieldKey === licenceFieldKey
    }) as recordTypes.LicenceCategoryField

    cityssm.openHtmlModal('licenceCategoryField-edit', {
      onshow(modalElement) {
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--licenceFieldKey'
          ) as HTMLInputElement
        ).value = licenceFieldKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--licenceField'
          ) as HTMLInputElement
        ).value = licenceCategoryField.licenceField
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--licenceFieldDescription'
          ) as HTMLTextAreaElement
        ).value = licenceCategoryField.licenceFieldDescription

        if (licenceCategoryField.isRequired) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryFieldEdit--isRequired'
            ) as HTMLInputElement
          ).checked = true
        }

        const minimumLengthElement = modalElement.querySelector(
          '#licenceCategoryFieldEdit--minimumLength'
        ) as HTMLInputElement
        const maximumLengthElement = modalElement.querySelector(
          '#licenceCategoryFieldEdit--maximumLength'
        ) as HTMLInputElement

        minimumLengthElement.value =
          licenceCategoryField.minimumLength.toString()

        minimumLengthElement.addEventListener('keyup', () => {
          maximumLengthElement.min = minimumLengthElement.value
        })

        maximumLengthElement.value =
          licenceCategoryField.maximumLength.toString()
        maximumLengthElement.min = licenceCategoryField.minimumLength.toString()
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--pattern'
          ) as HTMLInputElement
        ).value = licenceCategoryField.pattern
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--printKey'
          ) as HTMLInputElement
        ).value = licenceCategoryField.printKey
      },
      onshown(modalElement, closeModalFunction) {
        editLicenceCategoryFieldModalCloseFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--licenceField'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('form')
          ?.addEventListener('submit', updateLicenceCategoryFieldSubmitFunction)

        modalElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', confirmDeleteLicenceCategoryFieldFunction)

        bulmaJS.init(modalElement)
      },
      onhidden() {
        ;(
          document.querySelector(
            "#form--licenceCategoryFieldAdd button[type='submit']"
          ) as HTMLButtonElement
        ).focus()
      }
    })
  }

  function openEditLicenceCategoryFieldModalByClick(clickEvent: Event): void {
    clickEvent.preventDefault()

    const licenceFieldKey =
      (clickEvent.currentTarget as HTMLElement).dataset.licenceFieldKey ?? ''

    openEditLicenceCategoryFieldModal(licenceFieldKey)
  }

  const licenceCategoryField_dragDataPrefix = 'licenceFieldKey:'

  function licenceCategoryField_dragstart(dragEvent: DragEvent): void {
    dragEvent.dataTransfer.dropEffect = 'move'

    const data =
      licenceCategoryField_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceFieldKey

    dragEvent.dataTransfer.setData('text/plain', data)
  }

  function licenceCategoryField_dragover(dragEvent: DragEvent): void {
    if (
      dragEvent.dataTransfer
        .getData('text/plain')
        .startsWith(licenceCategoryField_dragDataPrefix)
    ) {
      const licenceFieldKey_drag = dragEvent.dataTransfer
        .getData('text/plain')
        .slice(licenceCategoryField_dragDataPrefix.length)

      const dropElement = dragEvent.currentTarget as HTMLElement
      const licenceFieldKey_drop = dropElement.dataset.licenceFieldKey

      if (licenceFieldKey_drag !== licenceFieldKey_drop) {
        dragEvent.preventDefault()
        dragEvent.dataTransfer.dropEffect = 'move'
        dropElement.style.borderTop = '20px solid #ededed'
      }
    }
  }

  function licenceCategoryField_dragleave(dragEvent: DragEvent): void {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  function licenceCategoryField_drop(dragEvent: DragEvent): void {
    dragEvent.preventDefault()

    const licenceFieldKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryField_dragDataPrefix.length)

    const licenceFieldKey_to = (dragEvent.currentTarget as HTMLElement).dataset
      .licenceFieldKey

    cityssm.postJSON(
      `${glm.urlPrefix}/admin/doMoveLicenceCategoryField`,
      {
        licenceFieldKey_from,
        licenceFieldKey_to
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          licenceCategoryFields: recordTypes.LicenceCategoryField[]
        }

        licenceCategoryFields = responseJSON.licenceCategoryFields
        renderLicenceCategoryFields()
        doRefreshOnClose = true
      }
    )
  }

  function renderLicenceCategoryFields(): void {
    const fieldsContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryFields'
    ) as HTMLElement

    if (licenceCategoryFields.length === 0) {
      fieldsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no additional fields captured with this category.</p>
          </div>`
    } else {
      const fieldsPanelElement = document.createElement('div')
      fieldsPanelElement.className = 'panel'

      for (const categoryField of licenceCategoryFields) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.licenceFieldKey =
          categoryField.licenceFieldKey
        panelBlockElement.style.transition = 'border-width 80ms'
        panelBlockElement.setAttribute('role', 'button')

        // eslint-disable-next-line no-unsanitized/property
        panelBlockElement.innerHTML = `<div class="columns is-mobile">
            <div class="column">
              <h4>${cityssm.escapeHTML(categoryField.licenceField)}</h4>
              <p class="is-size-7">
                ${cityssm.escapeHTML(categoryField.licenceFieldDescription)}
              </p>
              </div>
              ${
                categoryField.isRequired
                  ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
                  : ''
              }</div>`

        panelBlockElement.addEventListener(
          'click',
          openEditLicenceCategoryFieldModalByClick
        )

        if (licenceCategoryFields.length > 1) {
          panelBlockElement.draggable = true
          panelBlockElement.addEventListener(
            'dragstart',
            licenceCategoryField_dragstart
          )
          panelBlockElement.addEventListener(
            'dragover',
            licenceCategoryField_dragover
          )
          panelBlockElement.addEventListener(
            'dragleave',
            licenceCategoryField_dragleave
          )
          panelBlockElement.addEventListener('drop', licenceCategoryField_drop)
        }

        fieldsPanelElement.append(panelBlockElement)
      }

      fieldsContainerElement.innerHTML = ''
      fieldsContainerElement.append(fieldsPanelElement)
    }
  }

  // Licence Category Approvals

  let licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]

  function openEditLicenceCategoryApprovalModal(
    licenceApprovalKey: string
  ): void {
    let editLicenceCategoryApprovalModalCloseFunction: () => void

    function updateLicenceCategoryApprovalSubmitFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doUpdateLicenceCategoryApproval`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
          }

          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
            editLicenceCategoryApprovalModalCloseFunction()
            renderLicenceCategoryApprovals()
            doRefreshOnClose = true
          }
        }
      )
    }

    function deleteLicenceCategoryApprovalFunction(): void {
      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doDeleteLicenceCategoryApproval`,
        {
          licenceApprovalKey
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: true
            licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
          }

          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
            renderLicenceCategoryApprovals()
            editLicenceCategoryApprovalModalCloseFunction()
            doRefreshOnClose = true
          }
        }
      )
    }

    function confirmDeleteLicenceCategoryApprovalFunction(
      clickEvent: Event
    ): void {
      clickEvent.preventDefault()

      bulmaJS.confirm({
        title: 'Delete Approval',
        message: 'Are you sure you want to delete this approval?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete It',
          callbackFunction: deleteLicenceCategoryApprovalFunction
        }
      })
    }

    const licenceCategoryApproval = licenceCategoryApprovals.find(
      (possibleField) => {
        return possibleField.licenceApprovalKey === licenceApprovalKey
      }
    )

    cityssm.openHtmlModal('licenceCategoryApproval-edit', {
      onshow(modalElement) {
        glm.populateAliases(modalElement)
        ;(
          modalElement.querySelector(
            '#licenceCategoryApprovalEdit--licenceApprovalKey'
          ) as HTMLInputElement
        ).value = licenceApprovalKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryApprovalEdit--licenceApproval'
          ) as HTMLInputElement
        ).value = licenceCategoryApproval.licenceApproval
        ;(
          modalElement.querySelector(
            '#licenceCategoryApprovalEdit--licenceApprovalDescription'
          ) as HTMLTextAreaElement
        ).value = licenceCategoryApproval.licenceApprovalDescription

        if (licenceCategoryApproval.isRequiredForNew) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryApprovalEdit--isRequiredForNew'
            ) as HTMLInputElement
          ).checked = true
        }

        if (licenceCategoryApproval.isRequiredForRenewal) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryApprovalEdit--isRequiredForRenewal'
            ) as HTMLInputElement
          ).checked = true
        }

        ;(
          modalElement.querySelector(
            '#licenceCategoryApprovalEdit--printKey'
          ) as HTMLTextAreaElement
        ).value = licenceCategoryApproval.printKey
      },
      onshown(modalElement, closeModalFunction) {
        editLicenceCategoryApprovalModalCloseFunction = closeModalFunction

        modalElement
          .querySelector('form')
          ?.addEventListener(
            'submit',
            updateLicenceCategoryApprovalSubmitFunction
          )

        modalElement
          .querySelector('.is-delete-button')
          ?.addEventListener(
            'click',
            confirmDeleteLicenceCategoryApprovalFunction
          )

        bulmaJS.init(modalElement)
      }
    })
  }

  function openEditLicenceCategoryApprovalModalByClick(
    clickEvent: Event
  ): void {
    clickEvent.preventDefault()

    const licenceApprovalKey = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceApprovalKey
    openEditLicenceCategoryApprovalModal(licenceApprovalKey)
  }

  const licenceCategoryApproval_dragDataPrefix = 'licenceApprovalKey:'

  function licenceCategoryApproval_dragstart(dragEvent: DragEvent): void {
    dragEvent.dataTransfer.dropEffect = 'move'
    const data =
      licenceCategoryApproval_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceApprovalKey
    dragEvent.dataTransfer.setData('text/plain', data)
  }

  function licenceCategoryApproval_dragover(dragEvent: DragEvent): void {
    if (
      dragEvent.dataTransfer
        .getData('text/plain')
        .startsWith(licenceCategoryApproval_dragDataPrefix)
    ) {
      const licenceApprovalKey_drag = dragEvent.dataTransfer
        .getData('text/plain')
        .slice(licenceCategoryApproval_dragDataPrefix.length)

      const dropElement = dragEvent.currentTarget as HTMLElement
      const licenceApprovalKey_drop = dropElement.dataset.licenceApprovalKey

      if (licenceApprovalKey_drag !== licenceApprovalKey_drop) {
        dragEvent.preventDefault()
        dragEvent.dataTransfer.dropEffect = 'move'
        dropElement.style.borderTop = '20px solid #ededed'
      }
    }
  }

  function licenceCategoryApproval_dragleave(dragEvent: DragEvent): void {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  function licenceCategoryApproval_drop(dragEvent: DragEvent): void {
    dragEvent.preventDefault()

    const licenceApprovalKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryApproval_dragDataPrefix.length)

    const licenceApprovalKey_to = (dragEvent.currentTarget as HTMLElement)
      .dataset.licenceApprovalKey

    cityssm.postJSON(
      `${glm.urlPrefix}/admin/doMoveLicenceCategoryApproval`,
      {
        licenceApprovalKey_from,
        licenceApprovalKey_to
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
        }

        licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
        renderLicenceCategoryApprovals()
        doRefreshOnClose = true
      }
    )
  }

  function renderLicenceCategoryApprovals(): void {
    const approvalsContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryApprovals'
    ) as HTMLElement

    if (licenceCategoryApprovals.length === 0) {
      approvalsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no approvals associated with this category.</p>
        </div>`
    } else {
      const approvalsPanelElement = document.createElement('div')
      approvalsPanelElement.className = 'panel'

      for (const categoryApproval of licenceCategoryApprovals) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.licenceApprovalKey =
          categoryApproval.licenceApprovalKey
        panelBlockElement.setAttribute('role', 'button')

        // eslint-disable-next-line no-unsanitized/property
        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
            <h4>
              ${cityssm.escapeHTML(categoryApproval.licenceApproval)}
            </h4>
            <p class="is-size-7">
              ${cityssm.escapeHTML(categoryApproval.licenceApprovalDescription)}
            </p>
          </div>
          ${
            categoryApproval.isRequiredForNew ||
            categoryApproval.isRequiredForRenewal
              ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
              : ''
          }</div>`

        panelBlockElement.addEventListener(
          'click',
          openEditLicenceCategoryApprovalModalByClick
        )

        if (licenceCategoryApprovals.length > 1) {
          panelBlockElement.draggable = true
          panelBlockElement.addEventListener(
            'dragstart',
            licenceCategoryApproval_dragstart
          )
          panelBlockElement.addEventListener(
            'dragover',
            licenceCategoryApproval_dragover
          )
          panelBlockElement.addEventListener(
            'dragleave',
            licenceCategoryApproval_dragleave
          )
          panelBlockElement.addEventListener(
            'drop',
            licenceCategoryApproval_drop
          )
        }

        approvalsPanelElement.append(panelBlockElement)
      }

      approvalsContainerElement.innerHTML = ''
      approvalsContainerElement.append(approvalsPanelElement)
    }
  }

  // Licence Category Fees

  let licenceCategoryFees: recordTypes.LicenceCategoryFee[]

  const openEditLicenceCategoryFeeModal = (licenceFeeId: number) => {
    let editLicenceCategoryFeeModalCloseFunction: () => void

    const updateLicenceCategoryFeeSubmitFunction = (formEvent: SubmitEvent) => {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doUpdateLicenceCategoryFee`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategoryFees: recordTypes.LicenceCategoryFee[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = true

            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            editLicenceCategoryFeeModalCloseFunction()
          }
        }
      )
    }

    function deleteLicenceCategoryFeeFunction(): void {
      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doDeleteLicenceCategoryFee`,
        {
          licenceFeeId
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategoryFees: recordTypes.LicenceCategoryFee[]
          }

          if (responseJSON.success) {
            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            doRefreshOnClose = true

            editLicenceCategoryFeeModalCloseFunction()
          }
        }
      )
    }

    function confirmDeleteLicenceCategoryFeeFunction(clickEvent: Event): void {
      clickEvent.preventDefault()

      bulmaJS.confirm({
        title: 'Delete Fee',
        message: 'Are you sure you want to delete this fee record?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete It',
          callbackFunction: deleteLicenceCategoryFeeFunction
        }
      })
    }

    const licenceCategoryFee = licenceCategoryFees.find((possibleField) => {
      return possibleField.licenceFeeId === licenceFeeId
    }) as recordTypes.LicenceCategoryFee

    cityssm.openHtmlModal('licenceCategoryFee-edit', {
      onshow(modalElement) {
        glm.populateAliases(modalElement)
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--licenceFeeId'
          ) as HTMLInputElement
        ).value = licenceCategoryFee.licenceFeeId.toString()
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--effectiveStartDateString'
          ) as HTMLInputElement
        ).value = licenceCategoryFee.effectiveStartDateString
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--effectiveEndDateString'
          ) as HTMLInputElement
        ).value = licenceCategoryFee.effectiveEndDateString
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--licenceFee'
          ) as HTMLInputElement
        ).value = licenceCategoryFee.licenceFee.toFixed(2)

        if (licenceCategoryFee.renewalFee) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryFeeEdit--renewalFee'
            ) as HTMLInputElement
          ).value = licenceCategoryFee.renewalFee.toFixed(2)
        }

        if (licenceCategoryFee.replacementFee) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryFeeEdit--replacementFee'
            ) as HTMLInputElement
          ).value = licenceCategoryFee.replacementFee.toFixed(2)
        }

        if (!includeReplacementFee) {
          modalElement
            .querySelector('#licenceCategoryFeeEdit--replacementFee')
            ?.closest('.column')
            ?.classList.add('is-hidden')
        }
      },
      onshown(modalElement, closeModalFunction) {
        editLicenceCategoryFeeModalCloseFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--effectiveStartDateString'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('form')
          ?.addEventListener('submit', updateLicenceCategoryFeeSubmitFunction)

        modalElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', confirmDeleteLicenceCategoryFeeFunction)

        bulmaJS.init(modalElement)
      }
    })
  }

  function openEditLicenceCategoryFeeModalByClick(clickEvent: Event): void {
    clickEvent.preventDefault()

    const licenceFeeId = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceFeeId
    openEditLicenceCategoryFeeModal(Number.parseInt(licenceFeeId, 10))
  }

  function renderLicenceCategoryFees(): void {
    const feesContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryFees'
    ) as HTMLElement

    if (licenceCategoryFees.length === 0) {
      feesContainerElement.innerHTML = `<div class="message is-warning">
        <p class="message-body">There are no fees associated with this category.</p>
        </div>`
    } else {
      const feesPanelElement = document.createElement('div')
      feesPanelElement.className = 'panel'

      const currentDateString = cityssm.dateToString(new Date())

      for (const categoryFee of licenceCategoryFees) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.licenceFeeId =
          categoryFee.licenceFeeId.toString()

        let isEffective = false
        let effectiveHTML: string

        if (!categoryFee.effectiveStartDate) {
          effectiveHTML =
            '<span class="has-text-danger">No Effective Date</span>'
        } else {
          effectiveHTML =
            'From ' +
            categoryFee.effectiveStartDateString +
            (categoryFee.effectiveEndDate
              ? ' to ' + categoryFee.effectiveEndDateString
              : '')

          if (
            categoryFee.effectiveStartDateString <= currentDateString &&
            (!categoryFee.effectiveEndDate ||
              categoryFee.effectiveEndDateString >= currentDateString)
          ) {
            isEffective = true
          }
        }

        // eslint-disable-next-line no-unsanitized/property
        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
          <h4>${effectiveHTML}</h4>
          <p class="is-size-7">
            $${categoryFee.licenceFee.toFixed(2)} fee
          </p>
          </div>
          ${
            isEffective
              ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"></i></div>'
              : ''
          }
          </div>`

        panelBlockElement.addEventListener(
          'click',
          openEditLicenceCategoryFeeModalByClick
        )

        feesPanelElement.append(panelBlockElement)
      }

      feesContainerElement.innerHTML = ''
      feesContainerElement.append(feesPanelElement)
    }
  }

  // Licence Category Additional Fees

  let licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]

  function openEditLicenceCategoryAdditionalFeeModal(
    licenceAdditionalFeeKey: string
  ): void {
    let editLicenceCategoryAdditionalFeeModalElement: HTMLElement
    let editLicenceCategoryAdditionalFeeModalCloseFunction: () => void

    function updateLicenceCategoryAdditionalFeeSubmitFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doUpdateLicenceCategoryAdditionalFee`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
          }

          if (responseJSON.success) {
            licenceCategoryAdditionalFees =
              responseJSON.licenceCategoryAdditionalFees
            editLicenceCategoryAdditionalFeeModalCloseFunction()
            renderLicenceCategoryAdditionalFees()
            doRefreshOnClose = true
          }
        }
      )
    }

    function deleteLicenceCategoryAdditionalFeeFunction(): void {
      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doDeleteLicenceCategoryAdditionalFee`,
        {
          licenceAdditionalFeeKey
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: true
            licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
          }

          if (responseJSON.success) {
            licenceCategoryAdditionalFees =
              responseJSON.licenceCategoryAdditionalFees
            renderLicenceCategoryAdditionalFees()
            editLicenceCategoryAdditionalFeeModalCloseFunction()
            doRefreshOnClose = true
          }
        }
      )
    }

    function confirmDeleteLicenceCategoryAdditionalFeeFunction(
      clickEvent: Event
    ): void {
      clickEvent.preventDefault()

      bulmaJS.confirm({
        title: 'Delete Additional Fee',
        message: 'Are you sure you want to delete this additional fee?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete It',
          callbackFunction: deleteLicenceCategoryAdditionalFeeFunction
        }
      })
    }

    function updateAdditionalFeeTypeFields(): void {
      const additionalFeeType = (
        editLicenceCategoryAdditionalFeeModalElement.querySelector(
          '#licenceCategoryAdditionalFeeEdit--additionalFeeType'
        ) as HTMLSelectElement
      ).value

      const additionalFeeFlatIconElement =
        editLicenceCategoryAdditionalFeeModalElement.querySelector(
          ".control[data-additional-fee-type='flat']"
        ) as HTMLElement
      const additionalFeePercentIconElement =
        editLicenceCategoryAdditionalFeeModalElement.querySelector(
          ".control[data-additional-fee-type='percent']"
        ) as HTMLElement
      const additionalFeeFunctionElement =
        editLicenceCategoryAdditionalFeeModalElement.querySelector(
          '#licenceCategoryAdditionalFeeEdit--additionalFeeFunction'
        ) as HTMLSelectElement

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (additionalFeeType) {
        case 'percent': {
          additionalFeePercentIconElement.classList.remove('is-hidden')
          additionalFeeFlatIconElement.classList.add('is-hidden')
          break
        }

        default: {
          additionalFeeFlatIconElement.classList.remove('is-hidden')
          additionalFeePercentIconElement.classList.add('is-hidden')
        }
      }

      // eslint-disable-next-line sonarjs/no-small-switch
      switch (additionalFeeType) {
        case 'function': {
          additionalFeeFunctionElement.disabled = false
          break
        }

        default: {
          additionalFeeFunctionElement.value = ''
          additionalFeeFunctionElement.disabled = true
          break
        }
      }
    }

    const licenceCategoryAdditionalFee = licenceCategoryAdditionalFees.find(
      (possibleAdditionalFee) => {
        return (
          possibleAdditionalFee.licenceAdditionalFeeKey ===
          licenceAdditionalFeeKey
        )
      }
    )

    cityssm.openHtmlModal('licenceCategoryAdditionalFee-edit', {
      onshow(modalElement) {
        glm.populateAliases(modalElement)

        editLicenceCategoryAdditionalFeeModalElement = modalElement
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeEdit--licenceAdditionalFeeKey'
          ) as HTMLInputElement
        ).value = licenceAdditionalFeeKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeEdit--additionalFee'
          ) as HTMLInputElement
        ).value = licenceCategoryAdditionalFee.additionalFee
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeEdit--additionalFeeType'
          ) as HTMLSelectElement
        ).value = licenceCategoryAdditionalFee.additionalFeeType
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeEdit--additionalFeeNumber'
          ) as HTMLInputElement
        ).value = licenceCategoryAdditionalFee.additionalFeeNumber.toFixed(2)
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeEdit--additionalFeeFunction'
          ) as HTMLSelectElement
        ).value = licenceCategoryAdditionalFee.additionalFeeFunction

        updateAdditionalFeeTypeFields()

        if (licenceCategoryAdditionalFee.isRequired) {
          ;(
            modalElement.querySelector(
              '#licenceCategoryAdditionalFeeEdit--isRequired'
            ) as HTMLInputElement
          ).checked = true
        }
      },
      onshown(modalElement, closeModalFunction) {
        editLicenceCategoryAdditionalFeeModalCloseFunction = closeModalFunction

        modalElement
          .querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeType')
          ?.addEventListener('change', updateAdditionalFeeTypeFields)

        modalElement
          .querySelector('form')
          ?.addEventListener(
            'submit',
            updateLicenceCategoryAdditionalFeeSubmitFunction
          )

        modalElement
          .querySelector('.is-delete-button')
          ?.addEventListener(
            'click',
            confirmDeleteLicenceCategoryAdditionalFeeFunction
          )

        bulmaJS.init(modalElement)
      }
    })
  }

  function openEditLicenceCategoryAdditionalFeeModalByClick(
    clickEvent: Event
  ): void {
    clickEvent.preventDefault()

    const licenceAdditionalFeeKey =
      (clickEvent.currentTarget as HTMLElement).dataset
        .licenceAdditionalFeeKey ?? ''
    openEditLicenceCategoryAdditionalFeeModal(licenceAdditionalFeeKey)
  }

  const licenceCategoryAdditionalFee_dragDataPrefix = 'licenceAdditionalFeeKey:'

  function licenceCategoryAdditionalFee_dragstart(dragEvent: DragEvent): void {
    dragEvent.dataTransfer.dropEffect = 'move'
    const data =
      licenceCategoryAdditionalFee_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceAdditionalFeeKey
    dragEvent.dataTransfer.setData('text/plain', data)
  }

  function licenceCategoryAdditionalFee_dragover(dragEvent: DragEvent): void {
    if (
      dragEvent.dataTransfer
        .getData('text/plain')
        .startsWith(licenceCategoryAdditionalFee_dragDataPrefix)
    ) {
      const licenceAdditionalFeeKey_drag = dragEvent.dataTransfer
        .getData('text/plain')
        .slice(licenceCategoryAdditionalFee_dragDataPrefix.length)

      const dropElement = dragEvent.currentTarget as HTMLElement
      const licenceAdditionalFeeKey_drop =
        dropElement.dataset.licenceAdditionalFeeKey

      if (licenceAdditionalFeeKey_drag !== licenceAdditionalFeeKey_drop) {
        dragEvent.preventDefault()
        dragEvent.dataTransfer.dropEffect = 'move'
        dropElement.style.borderTop = '20px solid #ededed'
      }
    }
  }

  function licenceCategoryAdditionalFee_dragleave(dragEvent: DragEvent): void {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  function licenceCategoryAdditionalFee_drop(dragEvent: DragEvent): void {
    dragEvent.preventDefault()

    const licenceAdditionalFeeKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryAdditionalFee_dragDataPrefix.length)
    const licenceAdditionalFeeKey_to = (dragEvent.currentTarget as HTMLElement)
      .dataset.licenceAdditionalFeeKey

    cityssm.postJSON(
      `${glm.urlPrefix}/admin/doMoveLicenceCategoryAdditionalFee`,
      {
        licenceAdditionalFeeKey_from,
        licenceAdditionalFeeKey_to
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
        }

        licenceCategoryAdditionalFees =
          responseJSON.licenceCategoryAdditionalFees
        renderLicenceCategoryAdditionalFees()
        doRefreshOnClose = true
      }
    )
  }

  function renderLicenceCategoryAdditionalFees(): void {
    const additionalFeesContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryAdditionalFees'
    ) as HTMLElement

    if (licenceCategoryAdditionalFees.length === 0) {
      additionalFeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no additional fees associated with this category.</p>
        </div>`
    } else {
      const additionalFeesPanelElement = document.createElement('div')
      additionalFeesPanelElement.className = 'panel'

      for (const categoryAdditionalFee of licenceCategoryAdditionalFees) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.licenceAdditionalFeeKey =
          categoryAdditionalFee.licenceAdditionalFeeKey
        panelBlockElement.setAttribute('role', 'button')

        let additionalFeeDescriptionHTML = ''

        switch (categoryAdditionalFee.additionalFeeType) {
          case 'flat': {
            additionalFeeDescriptionHTML =
              '$' + categoryAdditionalFee.additionalFeeNumber.toFixed(2)
            break
          }

          case 'percent': {
            additionalFeeDescriptionHTML =
              categoryAdditionalFee.additionalFeeNumber.toPrecision(2) + '%'
            break
          }

          case 'function': {
            additionalFeeDescriptionHTML = `Function: ${categoryAdditionalFee.additionalFeeFunction}`
            break
          }
        }

        // eslint-disable-next-line no-unsanitized/property
        panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column">
            <h4>
            ${cityssm.escapeHTML(categoryAdditionalFee.additionalFee)}
            </h4>
            <p class="is-size-7">${additionalFeeDescriptionHTML}</p>
          </div>
          ${
            categoryAdditionalFee.isRequired
              ? '<div class="column is-narrow"><i class="fas fa-asterisk" aria-hidden="true"</i></div>'
              : ''
          }
          </div>`

        panelBlockElement.addEventListener(
          'click',
          openEditLicenceCategoryAdditionalFeeModalByClick
        )

        if (licenceCategoryAdditionalFees.length > 1) {
          panelBlockElement.draggable = true
          panelBlockElement.addEventListener(
            'dragstart',
            licenceCategoryAdditionalFee_dragstart
          )
          panelBlockElement.addEventListener(
            'dragover',
            licenceCategoryAdditionalFee_dragover
          )
          panelBlockElement.addEventListener(
            'dragleave',
            licenceCategoryAdditionalFee_dragleave
          )
          panelBlockElement.addEventListener(
            'drop',
            licenceCategoryAdditionalFee_drop
          )
        }

        additionalFeesPanelElement.append(panelBlockElement)
      }

      additionalFeesContainerElement.innerHTML = ''
      additionalFeesContainerElement.append(additionalFeesPanelElement)
    }
  }

  // Main Details

  function openEditLicenceCategoryModal(licenceCategoryKey: string): void {
    let categoryCloseModalFunction: () => void

    function deleteLicenceCategoryFunction(): void {
      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doDeleteLicenceCategory`,
        {
          licenceCategoryKey
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategories: recordTypes.LicenceCategory[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = false
            licenceCategories = responseJSON.licenceCategories

            categoryCloseModalFunction()

            renderLicenceCategories()
          }
        }
      )
    }

    function deleteLicenceCategoryConfirmFunction(clickEvent: Event): void {
      clickEvent.preventDefault()

      bulmaJS.confirm({
        title: 'Delete Category',
        message: 'Are you sure you want to delete this category?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete It',
          callbackFunction: deleteLicenceCategoryFunction
        }
      })
    }

    function updateLicenceCategorySubmitFunction(formEvent: SubmitEvent): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doUpdateLicenceCategory`,
        formElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            errorMessage?: string
          }

          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Category updated successfully.',
              contextualColorName: 'success'
            })

            doRefreshOnClose = true
          } else {
            bulmaJS.alert({
              title: 'Error Updating Category',
              message: responseJSON.errorMessage ?? '',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    function addLicenceCategoryFieldSubmitFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doAddLicenceCategoryField`,
        formElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            errorMessage: string
            licenceFieldKey: string
            licenceCategoryFields: recordTypes.LicenceCategoryField[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = true

            formElement.reset()

            licenceCategoryFields = responseJSON.licenceCategoryFields

            renderLicenceCategoryFields()

            openEditLicenceCategoryFieldModal(responseJSON.licenceFieldKey)
          }
        }
      )
    }

    function addLicenceCategoryApprovalSubmitFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doAddLicenceCategoryApproval`,
        formElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            errorMessage: string
            licenceApprovalKey: string
            licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = true

            formElement.reset()

            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals

            renderLicenceCategoryApprovals()

            openEditLicenceCategoryApprovalModal(
              responseJSON.licenceApprovalKey
            )
          }
        }
      )
    }

    function addLicenceCategoryFeeFunction(clickEvent: Event): void {
      clickEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doAddLicenceCategoryFee`,
        {
          licenceCategoryKey
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceFeeId: number
            licenceCategoryFees: recordTypes.LicenceCategoryFee[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = true

            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            openEditLicenceCategoryFeeModal(responseJSON.licenceFeeId)
          }
        }
      )
    }

    function addLicenceCategoryAdditionalFeeFunction(
      formEvent: SubmitEvent
    ): void {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doAddLicenceCategoryAdditionalFee`,
        formElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceAdditionalFeeKey: string
            licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
          }

          if (responseJSON.success) {
            doRefreshOnClose = true

            formElement.reset()

            licenceCategoryAdditionalFees =
              responseJSON.licenceCategoryAdditionalFees
            renderLicenceCategoryAdditionalFees()

            openEditLicenceCategoryAdditionalFeeModal(
              responseJSON.licenceAdditionalFeeKey
            )
          }
        }
      )
    }

    function renderEditLicenceCategory(responseJSON: {
      success?: boolean
      licenceCategory: recordTypes.LicenceCategory
    }): void {
      if (!responseJSON.success) {
        bulmaJS.alert({
          message: 'Error Loading Category.',
          contextualColorName: 'danger'
        })

        doRefreshOnClose = true

        return
      }

      const licenceCategory = responseJSON.licenceCategory
      ;(
        editModalElement.querySelector(
          '#licenceCategoryEdit--licenceCategory'
        ) as HTMLInputElement
      ).value = licenceCategory.licenceCategory
      ;(
        editModalElement.querySelector(
          '#licenceCategoryEdit--bylawNumber'
        ) as HTMLInputElement
      ).value = licenceCategory.bylawNumber

      const printEJSElement = editModalElement.querySelector(
        '#licenceCategoryEdit--printEJS'
      ) as HTMLSelectElement

      if (
        !printEJSElement.querySelector(
          "option[value='" + licenceCategory.printEJS + "']"
        )
      ) {
        const optionElement = document.createElement('option')
        optionElement.value = licenceCategory.printEJS
        optionElement.textContent = licenceCategory.printEJS + ' (Missing)'
        printEJSElement.append(optionElement)
      }

      printEJSElement.value = licenceCategory.printEJS

      const licenceLengthFunctionElement = editModalElement.querySelector(
        '#licenceCategoryEdit--licenceLengthFunction'
      ) as HTMLSelectElement

      if (
        !licenceLengthFunctionElement.querySelector(
          "option[value='" + licenceCategory.licenceLengthFunction + "']"
        )
      ) {
        const optionElement = document.createElement('option')
        optionElement.value = licenceCategory.licenceLengthFunction
        optionElement.textContent =
          licenceCategory.licenceLengthFunction + ' (Missing)'
        printEJSElement.append(optionElement)
      }

      licenceLengthFunctionElement.value = licenceCategory.licenceLengthFunction
      ;(
        editModalElement.querySelector(
          '#licenceCategoryEdit--licenceLengthYears'
        ) as HTMLInputElement
      ).value = licenceCategory.licenceLengthYears.toString()
      ;(
        editModalElement.querySelector(
          '#licenceCategoryEdit--licenceLengthMonths'
        ) as HTMLInputElement
      ).value = licenceCategory.licenceLengthMonths.toString()
      ;(
        editModalElement.querySelector(
          '#licenceCategoryEdit--licenceLengthDays'
        ) as HTMLInputElement
      ).value = licenceCategory.licenceLengthDays.toString()

      licenceCategoryFields = licenceCategory.licenceCategoryFields ?? []
      renderLicenceCategoryFields()

      licenceCategoryApprovals = licenceCategory.licenceCategoryApprovals ?? []
      renderLicenceCategoryApprovals()

      licenceCategoryFees = licenceCategory.licenceCategoryFees ?? []
      renderLicenceCategoryFees()

      licenceCategoryAdditionalFees =
        licenceCategory.licenceCategoryAdditionalFees ?? []
      renderLicenceCategoryAdditionalFees()
    }

    doRefreshOnClose = false

    cityssm.openHtmlModal('licenceCategory-edit', {
      onshow(modalElement) {
        editModalElement = modalElement

        glm.populateAliases(modalElement)
        ;(
          modalElement.querySelector(
            '#licenceCategoryEdit--licenceCategoryKey'
          ) as HTMLInputElement
        ).value = licenceCategoryKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldAdd--licenceCategoryKey'
          ) as HTMLInputElement
        ).value = licenceCategoryKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryApprovalAdd--licenceCategoryKey'
          ) as HTMLInputElement
        ).value = licenceCategoryKey
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdditionalFeeAdd--licenceCategoryKey'
          ) as HTMLInputElement
        ).value = licenceCategoryKey

        const printEJSElement = modalElement.querySelector(
          '#licenceCategoryEdit--printEJS'
        ) as HTMLSelectElement

        for (const printEJS of exports.printEJSList as string[]) {
          const optionElement = document.createElement('option')
          optionElement.value = printEJS
          optionElement.textContent = printEJS
          printEJSElement.append(optionElement)
        }

        const licenceLengthFunctionElement = modalElement.querySelector(
          '#licenceCategoryEdit--licenceLengthFunction'
        ) as HTMLSelectElement

        for (const licenceLengthFunctionName of exports.licenceLengthFunctionNames as string[]) {
          const optionElement = document.createElement('option')
          optionElement.value = licenceLengthFunctionName
          optionElement.textContent = licenceLengthFunctionName
          licenceLengthFunctionElement.append(optionElement)
        }

        cityssm.postJSON(
          `${glm.urlPrefix}/admin/doGetLicenceCategory`,
          {
            licenceCategoryKey
          },
          renderEditLicenceCategory
        )
      },
      onshown(modalElement, closeModalFunction) {
        categoryCloseModalFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryEdit--licenceCategory'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('#form--licenceCategoryEdit')
          ?.addEventListener('submit', updateLicenceCategorySubmitFunction)

        modalElement
          .querySelector('#form--licenceCategoryFieldAdd')
          ?.addEventListener('submit', addLicenceCategoryFieldSubmitFunction)

        modalElement
          .querySelector('#form--licenceCategoryApprovalAdd')
          ?.addEventListener('submit', addLicenceCategoryApprovalSubmitFunction)

        modalElement
          .querySelector('.is-add-fee-button')
          ?.addEventListener('click', addLicenceCategoryFeeFunction)

        modalElement
          .querySelector('#form--licenceCategoryAdditionalFeeAdd')
          ?.addEventListener('submit', addLicenceCategoryAdditionalFeeFunction)

        modalElement
          .querySelector('.is-delete-button')
          ?.addEventListener('click', deleteLicenceCategoryConfirmFunction)

        bulmaJS.toggleHtmlClipped()
        bulmaJS.init()
      },
      onhidden() {
        if (doRefreshOnClose) {
          getLicenceCategories()
        }
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  function openEditLicenceCategoryModalByClick(clickEvent: Event): void {
    clickEvent.preventDefault()

    const licenceCategoryKey =
      (clickEvent.currentTarget as HTMLElement).dataset.licenceCategoryKey ?? ''
    openEditLicenceCategoryModal(licenceCategoryKey)
  }

  /*
   * Add Licence Category
   */

  function openAddLicenceCategoryModal(): void {
    let addLicenceCategoryCloseModalFunction: () => void

    function addLicenceCategorySubmitFunction(formEvent: SubmitEvent): void {
      formEvent.preventDefault()

      cityssm.postJSON(
        `${glm.urlPrefix}/admin/doAddLicenceCategory`,
        formEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            licenceCategories: recordTypes.LicenceCategory[]
            licenceCategoryKey: string
          }

          if (responseJSON.success) {
            licenceCategories = responseJSON.licenceCategories
            renderLicenceCategories()

            addLicenceCategoryCloseModalFunction()

            openEditLicenceCategoryModal(responseJSON.licenceCategoryKey)
          }
        }
      )
    }

    cityssm.openHtmlModal('licenceCategory-add', {
      onshow(modalElement) {
        glm.populateAliases(modalElement)
      },
      onshown(modalElement, closeModalFunction) {
        bulmaJS.toggleHtmlClipped()
        addLicenceCategoryCloseModalFunction = closeModalFunction
        modalElement
          .querySelector('form')
          ?.addEventListener('submit', addLicenceCategorySubmitFunction)
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdd--licenceCategory'
          ) as HTMLInputElement
        ).focus()
      },
      onhidden() {
        ;(
          document.querySelector('#button--addLicenceCategory') as HTMLElement
        ).focus()
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  /*
   * Initialize
   */

  renderLicenceCategories()

  document
    .querySelector('#button--addLicenceCategory')
    ?.addEventListener('click', openAddLicenceCategoryModal)
})()

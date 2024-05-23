/* eslint-disable unicorn/filename-case, unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { GLM } from '../types/globalTypes.js'
import type * as recordTypes from '../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS
declare const glm: GLM
;(() => {
  const urlPrefix = document.querySelector('main').dataset.urlPrefix

  const includeReplacementFee = exports.includeReplacementFee as boolean

  let licenceCategories: recordTypes.LicenceCategory[] =
    exports.licenceCategories

  const licenceCategoriesContainerElement = document.querySelector(
    '#container--licenceCategories'
  ) as HTMLElement

  const licenceCategorySearchElement = document.querySelector(
    '#searchFilter--licenceCategory'
  ) as HTMLInputElement

  const renderLicenceCategories = () => {
    if (licenceCategories.length === 0) {
      licenceCategoriesContainerElement.innerHTML =
        '<div class="message is-warning">' +
        '<p class="message-body">There are no categories available.</p>' +
        '</div>'

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

      panelBlockElement.innerHTML =
        '<div class="columns is-multiline is-mobile">' +
        ('<div class="column is-6-tablet is-12-mobile">' +
          '<strong>' +
          cityssm.escapeHTML(licenceCategory.licenceCategory) +
          '</strong><br />' +
          '<span class="is-size-7">' +
          cityssm.escapeHTML(licenceCategory.bylawNumber) +
          '</span>' +
          '</div>') +
        ('<div class="column is-6-mobile has-text-centered">' +
          (licenceCategory.hasEffectiveFee
            ? '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Effective Fee</span>'
            : '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Effective Fee</span>') +
          '</div>') +
        ('<div class="column is-6-mobile has-text-centered">' +
          (licenceCategory.printEJS === ''
            ? '<i class="fas fa-exclamation-triangle has-text-danger"></i><br /><span class="is-size-7">No Print Template</span>'
            : '<i class="fas fa-check has-text-success"></i><br /><span class="is-size-7">Print Template</span>') +
          '</div>') +
        '</div>'

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
      licenceCategoriesContainerElement.innerHTML =
        '<div class="message is-info">' +
        '<p class="message-body">There are no categories available that meet the search criteria.</p>' +
        '</div>'
    }
  }

  const getLicenceCategories = () => {
    licenceCategoriesContainerElement.innerHTML =
      '<p class="has-text-centered has-text-grey-lighter">' +
      '<i class="fas fa-3x fa-circle-notch fa-spin" aria-hidden="true"></i><br />' +
      '<em>Loading categories...</em>' +
      '</p>'

    cityssm.postJSON(
      urlPrefix + '/admin/doGetLicenceCategories',
      {},
      (responseJSON: { licenceCategories: recordTypes.LicenceCategory[] }) => {
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

  const openEditLicenceCategoryFieldModal = (licenceFieldKey: string) => {
    let editLicenceCategoryFieldModalCloseFunction: () => void

    const updateLicenceCategoryFieldSubmitFunction = (
      formEvent: SubmitEvent
    ) => {
      formEvent.preventDefault()

      cityssm.postJSON(
        urlPrefix + '/admin/doUpdateLicenceCategoryField',
        formEvent.currentTarget,
        (responseJSON: {
          success: boolean
          licenceCategoryFields: recordTypes.LicenceCategoryField[]
        }) => {
          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields
            editLicenceCategoryFieldModalCloseFunction()
            renderLicenceCategoryFields()
            doRefreshOnClose = true
          }
        }
      )
    }

    const deleteLicenceCategoryFieldFunction = () => {
      cityssm.postJSON(
        urlPrefix + '/admin/doDeleteLicenceCategoryField',
        {
          licenceFieldKey
        },
        (responseJSON: {
          success: true
          licenceCategoryFields: recordTypes.LicenceCategoryField[]
        }) => {
          if (responseJSON.success) {
            licenceCategoryFields = responseJSON.licenceCategoryFields
            renderLicenceCategoryFields()
            editLicenceCategoryFieldModalCloseFunction()
            doRefreshOnClose = true
          }
        }
      )
    }

    const confirmDeleteLicenceCategoryFieldFunction = (clickEvent: Event) => {
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
    })

    cityssm.openHtmlModal('licenceCategoryField-edit', {
      onshow: (modalElement) => {
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
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryFieldModalCloseFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryFieldEdit--licenceField'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('#form--licenceCategoryFieldEdit')
          .addEventListener('submit', updateLicenceCategoryFieldSubmitFunction)

        modalElement
          .querySelector('.is-delete-button')
          .addEventListener('click', confirmDeleteLicenceCategoryFieldFunction)

        bulmaJS.init(modalElement)
      },
      onhidden: () => {
        ;(
          document.querySelector(
            "#form--licenceCategoryFieldAdd button[type='submit']"
          ) as HTMLButtonElement
        ).focus()
      }
    })
  }

  const openEditLicenceCategoryFieldModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault()

    const licenceFieldKey = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceFieldKey
    openEditLicenceCategoryFieldModal(licenceFieldKey)
  }

  const licenceCategoryField_dragDataPrefix = 'licenceFieldKey:'

  const licenceCategoryField_dragstart = (dragEvent: DragEvent) => {
    dragEvent.dataTransfer.dropEffect = 'move'
    const data =
      licenceCategoryField_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceFieldKey
    dragEvent.dataTransfer.setData('text/plain', data)
  }

  const licenceCategoryField_dragover = (dragEvent: DragEvent) => {
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

  const licenceCategoryField_dragleave = (dragEvent: DragEvent) => {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  const licenceCategoryField_drop = (dragEvent: DragEvent) => {
    dragEvent.preventDefault()

    const licenceFieldKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryField_dragDataPrefix.length)
    const licenceFieldKey_to = (dragEvent.currentTarget as HTMLElement).dataset
      .licenceFieldKey

    cityssm.postJSON(
      urlPrefix + '/admin/doMoveLicenceCategoryField',
      {
        licenceFieldKey_from,
        licenceFieldKey_to
      },
      (responseJSON: {
        licenceCategoryFields: recordTypes.LicenceCategoryField[]
      }) => {
        licenceCategoryFields = responseJSON.licenceCategoryFields
        renderLicenceCategoryFields()
        doRefreshOnClose = true
      }
    )
  }

  const renderLicenceCategoryFields = () => {
    const fieldsContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryFields'
    ) as HTMLElement

    if (licenceCategoryFields.length === 0) {
      fieldsContainerElement.innerHTML =
        '<div class="message is-info">' +
        '<p class="message-body">There are no additional fields captured with this category.</p>' +
        '</div>'
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

        panelBlockElement.innerHTML =
          '<div class="columns is-mobile">' +
          ('<div class="column">' +
            '<h4>' +
            cityssm.escapeHTML(categoryField.licenceField) +
            '</h4>' +
            '<p class="is-size-7">' +
            cityssm.escapeHTML(categoryField.licenceFieldDescription) +
            '</p>' +
            '</div>') +
          (categoryField.isRequired
            ? '<div class="column is-narrow">' +
              '<i class="fas fa-asterisk" aria-hidden="true"</i>' +
              '</div>'
            : '') +
          '</div>'

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

  const openEditLicenceCategoryApprovalModal = (licenceApprovalKey: string) => {
    let editLicenceCategoryApprovalModalCloseFunction: () => void

    const updateLicenceCategoryApprovalSubmitFunction = (
      formEvent: SubmitEvent
    ) => {
      formEvent.preventDefault()

      cityssm.postJSON(
        urlPrefix + '/admin/doUpdateLicenceCategoryApproval',
        formEvent.currentTarget,
        (responseJSON: {
          success: boolean
          licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
        }) => {
          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
            editLicenceCategoryApprovalModalCloseFunction()
            renderLicenceCategoryApprovals()
            doRefreshOnClose = true
          }
        }
      )
    }

    const deleteLicenceCategoryApprovalFunction = () => {
      cityssm.postJSON(
        urlPrefix + '/admin/doDeleteLicenceCategoryApproval',
        {
          licenceApprovalKey
        },
        (responseJSON: {
          success: true
          licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
        }) => {
          if (responseJSON.success) {
            licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
            renderLicenceCategoryApprovals()
            editLicenceCategoryApprovalModalCloseFunction()
            doRefreshOnClose = true
          }
        }
      )
    }

    const confirmDeleteLicenceCategoryApprovalFunction = (
      clickEvent: Event
    ) => {
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
      onshow: (modalElement) => {
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
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryApprovalModalCloseFunction = closeModalFunction

        modalElement
          .querySelector('#form--licenceCategoryApprovalEdit')
          .addEventListener(
            'submit',
            updateLicenceCategoryApprovalSubmitFunction
          )

        modalElement
          .querySelector('.is-delete-button')
          .addEventListener(
            'click',
            confirmDeleteLicenceCategoryApprovalFunction
          )

        bulmaJS.init(modalElement)
      }
    })
  }

  const openEditLicenceCategoryApprovalModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault()

    const licenceApprovalKey = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceApprovalKey
    openEditLicenceCategoryApprovalModal(licenceApprovalKey)
  }

  const licenceCategoryApproval_dragDataPrefix = 'licenceApprovalKey:'

  const licenceCategoryApproval_dragstart = (dragEvent: DragEvent) => {
    dragEvent.dataTransfer.dropEffect = 'move'
    const data =
      licenceCategoryApproval_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceApprovalKey
    dragEvent.dataTransfer.setData('text/plain', data)
  }

  const licenceCategoryApproval_dragover = (dragEvent: DragEvent) => {
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

  const licenceCategoryApproval_dragleave = (dragEvent: DragEvent) => {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  const licenceCategoryApproval_drop = (dragEvent: DragEvent) => {
    dragEvent.preventDefault()

    const licenceApprovalKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryApproval_dragDataPrefix.length)
    const licenceApprovalKey_to = (dragEvent.currentTarget as HTMLElement)
      .dataset.licenceApprovalKey

    cityssm.postJSON(
      urlPrefix + '/admin/doMoveLicenceCategoryApproval',
      {
        licenceApprovalKey_from,
        licenceApprovalKey_to
      },
      (responseJSON: {
        licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[]
      }) => {
        licenceCategoryApprovals = responseJSON.licenceCategoryApprovals
        renderLicenceCategoryApprovals()
        doRefreshOnClose = true
      }
    )
  }

  const renderLicenceCategoryApprovals = () => {
    const approvalsContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryApprovals'
    ) as HTMLElement

    if (licenceCategoryApprovals.length === 0) {
      approvalsContainerElement.innerHTML =
        '<div class="message is-info">' +
        '<p class="message-body">There are no approvals associated with this category.</p>' +
        '</div>'
    } else {
      const approvalsPanelElement = document.createElement('div')
      approvalsPanelElement.className = 'panel'

      for (const categoryApproval of licenceCategoryApprovals) {
        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block'
        panelBlockElement.dataset.licenceApprovalKey =
          categoryApproval.licenceApprovalKey
        panelBlockElement.setAttribute('role', 'button')

        panelBlockElement.innerHTML =
          '<div class="columns is-mobile">' +
          ('<div class="column">' +
            '<h4>' +
            cityssm.escapeHTML(categoryApproval.licenceApproval) +
            '</h4>' +
            '<p class="is-size-7">' +
            cityssm.escapeHTML(categoryApproval.licenceApprovalDescription) +
            '</p>' +
            '</div>') +
          (categoryApproval.isRequiredForNew ||
          categoryApproval.isRequiredForRenewal
            ? '<div class="column is-narrow">' +
              '<i class="fas fa-asterisk" aria-hidden="true"</i>' +
              '</div>'
            : '') +
          '</div>'

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
        urlPrefix + '/admin/doUpdateLicenceCategoryFee',
        formEvent.currentTarget,
        (responseJSON: {
          success: boolean
          licenceCategoryFees?: recordTypes.LicenceCategoryFee[]
        }) => {
          if (responseJSON.success) {
            doRefreshOnClose = true

            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            editLicenceCategoryFeeModalCloseFunction()
          }
        }
      )
    }

    const deleteLicenceCategoryFeeFunction = () => {
      cityssm.postJSON(
        urlPrefix + '/admin/doDeleteLicenceCategoryFee',
        {
          licenceFeeId
        },
        (responseJSON: {
          success: boolean
          licenceCategoryFees?: recordTypes.LicenceCategoryFee[]
        }) => {
          if (responseJSON.success) {
            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            doRefreshOnClose = true

            editLicenceCategoryFeeModalCloseFunction()
          }
        }
      )
    }

    const confirmDeleteLicenceCategoryFeeFunction = (clickEvent: Event) => {
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
    })

    cityssm.openHtmlModal('licenceCategoryFee-edit', {
      onshow: (modalElement) => {
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
            .closest('.column')
            .classList.add('is-hidden')
        }
      },
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryFeeModalCloseFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryFeeEdit--effectiveStartDateString'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('#form--licenceCategoryFeeEdit')
          .addEventListener('submit', updateLicenceCategoryFeeSubmitFunction)

        modalElement
          .querySelector('.is-delete-button')
          .addEventListener('click', confirmDeleteLicenceCategoryFeeFunction)

        bulmaJS.init(modalElement)
      }
    })
  }

  const openEditLicenceCategoryFeeModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault()

    const licenceFeeId = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceFeeId
    openEditLicenceCategoryFeeModal(Number.parseInt(licenceFeeId, 10))
  }

  const renderLicenceCategoryFees = () => {
    const feesContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryFees'
    ) as HTMLElement

    if (licenceCategoryFees.length === 0) {
      feesContainerElement.innerHTML =
        '<div class="message is-warning">' +
        '<p class="message-body">There are no fees associated with this category.</p>' +
        '</div>'
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

        panelBlockElement.innerHTML =
          '<div class="columns is-mobile">' +
          ('<div class="column">' +
            '<h4>' +
            effectiveHTML +
            '</h4>' +
            '<p class="is-size-7">' +
            '$' +
            categoryFee.licenceFee.toFixed(2) +
            ' fee' +
            '</p>' +
            '</div>') +
          (isEffective
            ? '<div class="column is-narrow">' +
              '<i class="fas fa-asterisk" aria-hidden="true"</i>' +
              '</div>'
            : '') +
          '</div>'

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

  const openEditLicenceCategoryAdditionalFeeModal = (
    licenceAdditionalFeeKey: string
  ) => {
    let editLicenceCategoryAdditionalFeeModalElement: HTMLElement
    let editLicenceCategoryAdditionalFeeModalCloseFunction: () => void

    const updateLicenceCategoryAdditionalFeeSubmitFunction = (
      formEvent: SubmitEvent
    ) => {
      formEvent.preventDefault()

      cityssm.postJSON(
        urlPrefix + '/admin/doUpdateLicenceCategoryAdditionalFee',
        formEvent.currentTarget,
        (responseJSON: {
          success: boolean
          licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
        }) => {
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

    const deleteLicenceCategoryAdditionalFeeFunction = () => {
      cityssm.postJSON(
        urlPrefix + '/admin/doDeleteLicenceCategoryAdditionalFee',
        {
          licenceAdditionalFeeKey
        },
        (responseJSON: {
          success: true
          licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
        }) => {
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

    const confirmDeleteLicenceCategoryAdditionalFeeFunction = (
      clickEvent: Event
    ) => {
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

    const updateAdditionalFeeTypeFields = () => {
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

      switch (additionalFeeType) {
        case 'percent':
          additionalFeePercentIconElement.classList.remove('is-hidden')
          additionalFeeFlatIconElement.classList.add('is-hidden')
          break

        default:
          additionalFeeFlatIconElement.classList.remove('is-hidden')
          additionalFeePercentIconElement.classList.add('is-hidden')
      }

      switch (additionalFeeType) {
        case 'function':
          additionalFeeFunctionElement.disabled = false
          break

        default:
          additionalFeeFunctionElement.value = ''
          additionalFeeFunctionElement.disabled = true
          break
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
      onshow: (modalElement) => {
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
      onshown: (modalElement, closeModalFunction) => {
        editLicenceCategoryAdditionalFeeModalCloseFunction = closeModalFunction

        modalElement
          .querySelector('#licenceCategoryAdditionalFeeEdit--additionalFeeType')
          .addEventListener('change', updateAdditionalFeeTypeFields)

        modalElement
          .querySelector('#form--licenceCategoryAdditionalFeeEdit')
          .addEventListener(
            'submit',
            updateLicenceCategoryAdditionalFeeSubmitFunction
          )

        modalElement
          .querySelector('.is-delete-button')
          .addEventListener(
            'click',
            confirmDeleteLicenceCategoryAdditionalFeeFunction
          )

        bulmaJS.init(modalElement)
      }
    })
  }

  const openEditLicenceCategoryAdditionalFeeModalByClick = (
    clickEvent: Event
  ) => {
    clickEvent.preventDefault()

    const licenceAdditionalFeeKey = (clickEvent.currentTarget as HTMLElement)
      .dataset.licenceAdditionalFeeKey
    openEditLicenceCategoryAdditionalFeeModal(licenceAdditionalFeeKey)
  }

  const licenceCategoryAdditionalFee_dragDataPrefix = 'licenceAdditionalFeeKey:'

  const licenceCategoryAdditionalFee_dragstart = (dragEvent: DragEvent) => {
    dragEvent.dataTransfer.dropEffect = 'move'
    const data =
      licenceCategoryAdditionalFee_dragDataPrefix +
      (dragEvent.target as HTMLElement).dataset.licenceAdditionalFeeKey
    dragEvent.dataTransfer.setData('text/plain', data)
  }

  const licenceCategoryAdditionalFee_dragover = (dragEvent: DragEvent) => {
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

  const licenceCategoryAdditionalFee_dragleave = (dragEvent: DragEvent) => {
    const dropElement = dragEvent.currentTarget as HTMLElement
    dropElement.style.borderTopWidth = '0px'
  }

  const licenceCategoryAdditionalFee_drop = (dragEvent: DragEvent) => {
    dragEvent.preventDefault()

    const licenceAdditionalFeeKey_from = dragEvent.dataTransfer
      .getData('text/plain')
      .slice(licenceCategoryAdditionalFee_dragDataPrefix.length)
    const licenceAdditionalFeeKey_to = (dragEvent.currentTarget as HTMLElement)
      .dataset.licenceAdditionalFeeKey

    cityssm.postJSON(
      urlPrefix + '/admin/doMoveLicenceCategoryAdditionalFee',
      {
        licenceAdditionalFeeKey_from,
        licenceAdditionalFeeKey_to
      },
      (responseJSON: {
        licenceCategoryAdditionalFees: recordTypes.LicenceCategoryAdditionalFee[]
      }) => {
        licenceCategoryAdditionalFees =
          responseJSON.licenceCategoryAdditionalFees
        renderLicenceCategoryAdditionalFees()
        doRefreshOnClose = true
      }
    )
  }

  const renderLicenceCategoryAdditionalFees = () => {
    const additionalFeesContainerElement = editModalElement.querySelector(
      '#container--licenceCategoryAdditionalFees'
    ) as HTMLElement

    if (licenceCategoryAdditionalFees.length === 0) {
      additionalFeesContainerElement.innerHTML =
        '<div class="message is-info">' +
        '<p class="message-body">There are no additional fees associated with this category.</p>' +
        '</div>'
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
          case 'flat':
            additionalFeeDescriptionHTML =
              '$' + categoryAdditionalFee.additionalFeeNumber.toFixed(2)
            break

          case 'percent':
            additionalFeeDescriptionHTML =
              categoryAdditionalFee.additionalFeeNumber.toPrecision(2) + '%'
            break

          case 'function':
            additionalFeeDescriptionHTML =
              'Function: ' + categoryAdditionalFee.additionalFeeFunction
            break
        }

        panelBlockElement.innerHTML =
          '<div class="columns is-mobile">' +
          ('<div class="column">' +
            '<h4>' +
            cityssm.escapeHTML(categoryAdditionalFee.additionalFee) +
            '</h4>' +
            '<p class="is-size-7">' +
            additionalFeeDescriptionHTML +
            '</p>' +
            '</div>') +
          (categoryAdditionalFee.isRequired
            ? '<div class="column is-narrow">' +
              '<i class="fas fa-asterisk" aria-hidden="true"</i>' +
              '</div>'
            : '') +
          '</div>'

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

  const openEditLicenceCategoryModal = (licenceCategoryKey: string) => {
    let categoryCloseModalFunction: () => void

    const deleteLicenceCategoryFunction = () => {
      cityssm.postJSON(
        urlPrefix + '/admin/doDeleteLicenceCategory',
        {
          licenceCategoryKey
        },
        (responseJSON: {
          success: boolean
          licenceCategories: recordTypes.LicenceCategory[]
        }) => {
          if (responseJSON.success) {
            doRefreshOnClose = false
            licenceCategories = responseJSON.licenceCategories

            categoryCloseModalFunction()

            renderLicenceCategories()
          }
        }
      )
    }

    const deleteLicenceCategoryConfirmFunction = (clickEvent: Event) => {
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

    const updateLicenceCategorySubmitFunction = (formEvent: SubmitEvent) => {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget

      cityssm.postJSON(
        urlPrefix + '/admin/doUpdateLicenceCategory',
        formElement,
        (responseJSON: { success: boolean; errorMessage?: string }) => {
          if (responseJSON.success) {
            bulmaJS.alert({
              message: 'Category updated successfully.',
              contextualColorName: 'success'
            })

            doRefreshOnClose = true
          } else {
            bulmaJS.alert({
              title: 'Error Updating Category',
              message: responseJSON.errorMessage,
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    const addLicenceCategoryFieldSubmitFunction = (formEvent: SubmitEvent) => {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        urlPrefix + '/admin/doAddLicenceCategoryField',
        formElement,
        (responseJSON: {
          success: boolean
          errorMessage?: string
          licenceFieldKey?: string
          licenceCategoryFields?: recordTypes.LicenceCategoryField[]
        }) => {
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

    const addLicenceCategoryApprovalSubmitFunction = (
      formEvent: SubmitEvent
    ) => {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        urlPrefix + '/admin/doAddLicenceCategoryApproval',
        formElement,
        (responseJSON: {
          success: boolean
          errorMessage?: string
          licenceApprovalKey?: string
          licenceCategoryApprovals?: recordTypes.LicenceCategoryApproval[]
        }) => {
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

    const addLicenceCategoryFeeFunction = (clickEvent: Event) => {
      clickEvent.preventDefault()

      cityssm.postJSON(
        urlPrefix + '/admin/doAddLicenceCategoryFee',
        {
          licenceCategoryKey
        },
        (responseJSON: {
          success: boolean
          licenceFeeId?: number
          licenceCategoryFees?: recordTypes.LicenceCategoryFee[]
        }) => {
          if (responseJSON.success) {
            doRefreshOnClose = true

            licenceCategoryFees = responseJSON.licenceCategoryFees
            renderLicenceCategoryFees()

            openEditLicenceCategoryFeeModal(responseJSON.licenceFeeId)
          }
        }
      )
    }

    const addLicenceCategoryAdditionalFeeFunction = (
      formEvent: SubmitEvent
    ) => {
      formEvent.preventDefault()

      const formElement = formEvent.currentTarget as HTMLFormElement

      cityssm.postJSON(
        urlPrefix + '/admin/doAddLicenceCategoryAdditionalFee',
        formElement,
        (responseJSON: {
          success: boolean
          licenceAdditionalFeeKey?: string
          licenceCategoryAdditionalFees?: recordTypes.LicenceCategoryAdditionalFee[]
        }) => {
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

    const renderEditLicenceCategory = (responseJSON: {
      success?: boolean
      licenceCategory?: recordTypes.LicenceCategory
    }) => {
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

      licenceCategoryFields = licenceCategory.licenceCategoryFields
      renderLicenceCategoryFields()

      licenceCategoryApprovals = licenceCategory.licenceCategoryApprovals
      renderLicenceCategoryApprovals()

      licenceCategoryFees = licenceCategory.licenceCategoryFees
      renderLicenceCategoryFees()

      licenceCategoryAdditionalFees =
        licenceCategory.licenceCategoryAdditionalFees
      renderLicenceCategoryAdditionalFees()
    }

    doRefreshOnClose = false

    cityssm.openHtmlModal('licenceCategory-edit', {
      onshow: (modalElement) => {
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
          urlPrefix + '/admin/doGetLicenceCategory',
          {
            licenceCategoryKey
          },
          renderEditLicenceCategory
        )
      },
      onshown: (modalElement, closeModalFunction) => {
        categoryCloseModalFunction = closeModalFunction
        ;(
          modalElement.querySelector(
            '#licenceCategoryEdit--licenceCategory'
          ) as HTMLInputElement
        ).focus()

        modalElement
          .querySelector('#form--licenceCategoryEdit')
          .addEventListener('submit', updateLicenceCategorySubmitFunction)

        modalElement
          .querySelector('#form--licenceCategoryFieldAdd')
          .addEventListener('submit', addLicenceCategoryFieldSubmitFunction)

        modalElement
          .querySelector('#form--licenceCategoryApprovalAdd')
          .addEventListener('submit', addLicenceCategoryApprovalSubmitFunction)

        modalElement
          .querySelector('.is-add-fee-button')
          .addEventListener('click', addLicenceCategoryFeeFunction)

        modalElement
          .querySelector('#form--licenceCategoryAdditionalFeeAdd')
          .addEventListener('submit', addLicenceCategoryAdditionalFeeFunction)

        modalElement
          .querySelector('.is-delete-button')
          .addEventListener('click', deleteLicenceCategoryConfirmFunction)

        bulmaJS.toggleHtmlClipped()
        bulmaJS.init()
      },
      onhidden: () => {
        if (doRefreshOnClose) {
          getLicenceCategories()
        }
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped()
      }
    })
  }

  const openEditLicenceCategoryModalByClick = (clickEvent: Event) => {
    clickEvent.preventDefault()

    const licenceCategoryKey = (clickEvent.currentTarget as HTMLElement).dataset
      .licenceCategoryKey
    openEditLicenceCategoryModal(licenceCategoryKey)
  }

  /*
   * Add Licence Category
   */

  const openAddLicenceCategoryModal = () => {
    let addLicenceCategoryCloseModalFunction: () => void

    const addLicenceCategorySubmitFunction = (formEvent: SubmitEvent) => {
      formEvent.preventDefault()

      cityssm.postJSON(
        urlPrefix + '/admin/doAddLicenceCategory',
        formEvent.currentTarget,
        (responseJSON: {
          success: boolean
          licenceCategories?: recordTypes.LicenceCategory[]
          licenceCategoryKey?: string
        }) => {
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
      onshow: (modalElement) => {
        glm.populateAliases(modalElement)
      },
      onshown: (modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped()
        addLicenceCategoryCloseModalFunction = closeModalFunction
        modalElement
          .querySelector('form')
          .addEventListener('submit', addLicenceCategorySubmitFunction)
        ;(
          modalElement.querySelector(
            '#licenceCategoryAdd--licenceCategory'
          ) as HTMLInputElement
        ).focus()
      },
      onhidden: () => {
        ;(
          document.querySelector('#button--addLicenceCategory') as HTMLElement
        ).focus()
      },
      onremoved: () => {
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
    .addEventListener('click', openAddLicenceCategoryModal)
})()

/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { GLM } from '../../types/globalTypes.js'

declare const cityssm: cityssmGlobal
const glm: Partial<GLM> = {
  urlPrefix: document.querySelector('main')?.dataset.urlPrefix
}

;(() => {
  const urlPrefix = document.querySelector('main').dataset.urlPrefix

  const aliasSettingNames = [
    'licenceAlias',
    'licenceAliasPlural',
    'licenseeAlias',
    'licenseeAliasPlural',
    'renewalAlias'
  ]

  const populateAliases = (
    containerElement: HTMLElement,
    settingName: string
  ) => {
    const alias = exports[settingName] as string

    const elements = containerElement.querySelectorAll(
      "[data-setting='" + settingName + "']"
    )
    for (const element of elements) {
      element.textContent = alias
    }
  }

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  glm.populateAliases = (containerElement) => {
    for (const settingName of aliasSettingNames) {
      populateAliases(containerElement, settingName)
    }
  }

  glm.getBankName = (
    bankInstitutionNumber,
    bankTransitNumber,
    callbackFunction
  ) => {
    cityssm.postJSON(
      urlPrefix + '/licences/doGetBankName',
      {
        bankInstitutionNumber,
        bankTransitNumber
      },
      (responseJSON: { bankName: string }) => {
        callbackFunction(responseJSON.bankName)
      }
    )
  }

  glm.getDayName = (dateString: string) => {
    return dayNames[cityssm.dateStringToDate(dateString).getDay()]
  }
})()

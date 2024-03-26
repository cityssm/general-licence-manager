import Debug from 'debug'

import type * as recordTypes from '../types/recordTypes.js'

import database_getLicenceCategories from './licencesDB/getLicenceCategories.js'
import database_getLicenceCategory from './licencesDB/getLicenceCategory.js'

const debug = Debug('general-licence-manager:cache')

let licenceCategoriesList: recordTypes.LicenceCategory[]
const licenceCategoriesMap = new Map<string, recordTypes.LicenceCategory>()

export const getLicenceCategories = (): recordTypes.LicenceCategory[] => {
  if (!licenceCategoriesList) {
    debug('Cache miss: getLicenceCategories')
    licenceCategoriesList = database_getLicenceCategories()
  }
  return licenceCategoriesList
}

export const getLicenceCategory = (
  licenceCategoryKey: string
): recordTypes.LicenceCategory => {
  if (!licenceCategoriesMap.has(licenceCategoryKey)) {
    debug('Cache miss: getLicenceCategory(' + licenceCategoryKey + ')')
    licenceCategoriesMap.set(
      licenceCategoryKey,
      database_getLicenceCategory(licenceCategoryKey, {
        includeFields: true,
        includeFees: 'current',
        includeApprovals: true,
        includeAdditionalFees: true
      })
    )
  }

  return licenceCategoriesMap.get(licenceCategoryKey)
}

export const getLicenceCategoryAdditionalFee = (
  licenceAdditionalFeeKey: string
): recordTypes.LicenceCategoryAdditionalFee => {
  const licenceCategories = getLicenceCategories()

  for (const licenceCategory of licenceCategories) {
    const licenceCategoryAdditionalFees = getLicenceCategory(
      licenceCategory.licenceCategoryKey
    ).licenceCategoryAdditionalFees

    for (const licenceCategoryAdditionalFee of licenceCategoryAdditionalFees) {
      if (
        licenceCategoryAdditionalFee.licenceAdditionalFeeKey ===
        licenceAdditionalFeeKey
      ) {
        return licenceCategoryAdditionalFee
      }
    }
  }

  return undefined
}

export const clearAll = (): void => {
  licenceCategoriesList = undefined
  licenceCategoriesMap.clear()
}

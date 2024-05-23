import Debug from 'debug'

import type {
  LicenceCategory,
  LicenceCategoryAdditionalFee
} from '../types/recordTypes.js'

import database_getLicenceCategories from '../database/getLicenceCategories.js'
import database_getLicenceCategory from '../database/getLicenceCategory.js'

const debug = Debug('general-licence-manager:cache')

let licenceCategoriesList: LicenceCategory[] | undefined
const licenceCategoriesMap = new Map<string, LicenceCategory>()

export function getLicenceCategories(): LicenceCategory[] {
  if (licenceCategoriesList === undefined) {
    debug('Cache miss: getLicenceCategories')
    licenceCategoriesList = database_getLicenceCategories()
  }
  return licenceCategoriesList
}

export function getLicenceCategory(licenceCategoryKey: string): LicenceCategory | undefined {
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

export function getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey: string): LicenceCategoryAdditionalFee | undefined {
  const licenceCategories = getLicenceCategories()

  for (const licenceCategory of licenceCategories) {
    const licenceCategoryAdditionalFees = getLicenceCategory(licenceCategory.licenceCategoryKey)
      ?.licenceCategoryAdditionalFees ?? []

    for (const licenceCategoryAdditionalFee of licenceCategoryAdditionalFees) {
      if (licenceCategoryAdditionalFee.licenceAdditionalFeeKey ===
        licenceAdditionalFeeKey) {
        return licenceCategoryAdditionalFee
      }
    }
  }

  return undefined
}

export function clearAll(): void {
  licenceCategoriesList = undefined
  licenceCategoriesMap.clear()
}

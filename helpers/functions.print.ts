import fs from 'node:fs/promises'
import path from 'node:path'

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type {
  Licence,
  LicenceApproval,
  LicenceField
} from '../types/recordTypes.js'

import { getLicenceCategory } from './functions.cache.js'

let printEJSList: string[] = []

export async function getPrintEJSList(): Promise<string[]> {
  if (printEJSList.length === 0) {
    const printPath = path.join('print')

    const allFiles = await fs.readdir(printPath)

    const ejsList: string[] = []

    for (const fileName of allFiles) {
      const filePath = path.join(printPath, fileName)

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const fileStats = await fs.stat(filePath)

      if (fileStats.isFile() && fileName.toLowerCase().endsWith('.ejs')) {
        ejsList.push(fileName.slice(0, -4))
      }
    }

    printEJSList = ejsList
  }

  return printEJSList
}

export function getLicenceFieldByPrintKey(
  licence: Licence,
  printKey: string
): LicenceField | undefined {
  return licence.licenceFields?.find((currentLicenceField) => {
    return currentLicenceField.printKey === printKey
  })
}

export function getLicenceFieldsByPrintKeyPiece(
  licence: Licence,
  printKeyPiece: string
): LicenceField[] {
  return (
    licence.licenceFields?.filter((currentLicenceField) => {
      return (currentLicenceField.printKey ?? '').includes(printKeyPiece)
    }) ?? []
  )
}

export function getLicenceApprovalByPrintKey(
  licence: Licence,
  printKey: string
): LicenceApproval | undefined {
  return licence.licenceApprovals?.find((currentLicenceApproval) => {
    return currentLicenceApproval.printKey === printKey
  })
}

export function getLicenceLengthEndDateString(licence: Licence): string {
  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey)

  let licenceLengthEndDateString = ''

  if (licenceCategory === undefined) {
    return licenceLengthEndDateString
  }

  if ((licenceCategory?.licenceLengthFunction ?? '') !== '') {
    return licence.endDateString ?? ''
  }

  const calculatedEndDate = dateTimeFunctions.dateIntegerToDate(
    licence.startDate
  )

  if (licenceCategory.licenceLengthYears > 0) {
    calculatedEndDate.setFullYear(
      calculatedEndDate.getFullYear() + licenceCategory.licenceLengthYears
    )
    calculatedEndDate.setDate(calculatedEndDate.getDate() - 1)

    licenceLengthEndDateString = `${licenceCategory.licenceLengthYears} year${
      licenceCategory.licenceLengthYears === 1 ? '' : 's'
    }`
  }

  if (licenceCategory.licenceLengthMonths > 0) {
    calculatedEndDate.setMonth(
      calculatedEndDate.getMonth() + licenceCategory.licenceLengthMonths
    )
    calculatedEndDate.setDate(calculatedEndDate.getDate() - 1)

    licenceLengthEndDateString += `${
      (licenceLengthEndDateString === '' ? '' : ', ') +
      licenceCategory.licenceLengthMonths
    } month${licenceCategory.licenceLengthMonths === 1 ? '' : 's'}`
  }

  if (licenceCategory.licenceLengthDays > 0) {
    calculatedEndDate.setDate(
      calculatedEndDate.getDate() + licenceCategory.licenceLengthDays - 1
    )

    licenceLengthEndDateString += `${
      (licenceLengthEndDateString === '' ? '' : ', ') +
      licenceCategory.licenceLengthDays
    } day${licenceCategory.licenceLengthDays === 1 ? '' : 's'}`
  }

  if (
    licenceLengthEndDateString === '' ||
    licence.endDate !== dateTimeFunctions.dateToInteger(calculatedEndDate)
  ) {
    return licence.endDateString ?? ''
  }

  return licenceLengthEndDateString
}

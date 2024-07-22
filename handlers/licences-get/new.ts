import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import getCanadianBankName from '@cityssm/get-canadian-bank-name'
import type { Request, Response } from 'express'

import getLicence from '../../database/getLicence.js'
import { getLicenceCategories } from '../../helpers/functions.cache.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import type { Licence } from '../../types/recordTypes.js'

function getFirstPopulatedValue(...values: string[]): string {
  for (const value of values) {
    if ((value ?? '') !== '') {
      return value
    }
  }

  return ''
}

export default function handler(request: Request, response: Response): void {
  let relatedLicence: Licence | undefined

  if ((request.query.relatedLicenceId ?? '') !== '') {
    relatedLicence = getLicence(request.query.relatedLicenceId as string)
  }

  const licenseeName = getFirstPopulatedValue(
    request.query.licenseeName as string,
    relatedLicence?.licenseeName ?? ''
  )

  const licenseeBusinessName = getFirstPopulatedValue(
    request.query.licenseeBusinessName as string,
    relatedLicence?.licenseeBusinessName ?? ''
  )

  const licenseeAddress1 = getFirstPopulatedValue(
    request.query.licenseeAddress1 as string,
    relatedLicence?.licenseeAddress1 ?? ''
  )

  const licenseeAddress2 = getFirstPopulatedValue(
    request.query.licenseeAddress2 as string,
    relatedLicence?.licenseeAddress2 ?? ''
  )

  const licenseeCity = getFirstPopulatedValue(
    request.query.licenseeCity as string,
    relatedLicence?.licenseeCity ?? '',
    getConfigProperty('defaults.licenseeCity')
  )

  const licenseeProvince = getFirstPopulatedValue(
    request.query.licenseeProvince as string,
    relatedLicence?.licenseeProvince ?? '',
    getConfigProperty('defaults.licenseeProvince')
  )

  const licenseePostalCode = getFirstPopulatedValue(
    request.query.licenseePostalCode as string,
    relatedLicence?.licenseePostalCode ?? ''
  )

  const bankInstitutionNumber = getFirstPopulatedValue(
    request.query.bankInstitutionNumber as string,
    relatedLicence?.bankInstitutionNumber ?? ''
  )

  const bankTransitNumber = getFirstPopulatedValue(
    request.query.bankTransitNumber as string,
    relatedLicence?.bankTransitNumber ?? ''
  )

  const bankAccountNumber = getFirstPopulatedValue(
    request.query.bankAccountNumber as string,
    relatedLicence?.bankAccountNumber ?? ''
  )

  let bankName = ''

  if (bankInstitutionNumber !== '') {
    bankName = getCanadianBankName(bankInstitutionNumber, bankTransitNumber) ?? ''
  }

  const licenceCategories = getLicenceCategories()

  let startDateString = request.query.startDateString as string
  let startDate = 0
  if (!startDateString || startDateString === '') {
    const currentDate = new Date()
    startDateString = dateTimeFunctions.dateToString(currentDate)
    startDate = dateTimeFunctions.dateToInteger(currentDate)
  } else {
    startDate = dateTimeFunctions.dateStringToInteger(startDateString)
  }

  let isRenewal = false
  if (request.query.isRenewal && request.query.isRenewal !== '') {
    isRenewal = true
  }

  const licence: Licence = {
    licenceId: '',
    licenceCategoryKey: request.query.licenceCategoryKey as string,
    licenceNumber: '',
    licenseeName,
    licenseeBusinessName,
    licenseeAddress1,
    licenseeAddress2,
    licenseeCity,
    licenseeProvince,
    licenseePostalCode,
    bankInstitutionNumber,
    bankTransitNumber,
    bankName,
    bankAccountNumber,
    isRenewal,
    startDate,
    startDateString,
    endDateString: '',
    baseLicenceFee: '',
    baseReplacementFee: '',
    licenceFee: '',
    replacementFee: '',
    licenceAdditionalFees: []
  }

  response.render('licence-edit', {
    headTitle: `${getConfigProperty('settings.licenceAlias')} Create`,
    isCreate: true,
    licenceCategories,
    licence,
    relatedLicence
  })
}

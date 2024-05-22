import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'
import type * as expressSession from 'express-session'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { LicenceCategoryAdditionalFee } from '../../types/recordTypes.js'
import * as configFunctions from '../functions.config.js'
import * as licenceFunctions from '../functions.licence.js'

import saveLicenceApprovals from './saveLicenceApprovals.js'
import saveLicenceFields from './saveLicenceFields.js'

export interface UpdateLicenceForm {
  licenceId: string
  licenceNumber: string
  licenseeName: string
  licenseeBusinessName: string
  licenseeAddress1: string
  licenseeAddress2: string
  licenseeCity: string
  licenseeProvince: string
  licenseePostalCode: string
  bankInstitutionNumber: string
  bankTransitNumber: string
  bankAccountNumber: string
  isRenewal?: string
  startDateString: string
  endDateString: string
  baseLicenceFee?: string
  baseReplacementFee?: string
  licenceFee: string
  replacementFee: string
  licenceFieldKeys?: string
  licenceApprovalKeys?: string
  [fieldOrApprovalKey: string]: string
}

export default function updateLicence(
  licenceForm: UpdateLicenceForm,
  requestSession: expressSession.Session
): boolean {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  database
    .prepare(
      `update Licences
        set licenceNumber = ?,
        licenseeName = ?,
        licenseeBusinessName = ?,
        licenseeAddress1 = ?,
        licenseeAddress2 = ?,
        licenseeCity = ?,
        licenseeProvince = ?,
        licenseePostalCode = ?,
        bankInstitutionNumber = ?,
        bankTransitNumber = ?,
        bankAccountNumber = ?,
        isRenewal = ?,
        startDate = ?,
        endDate = ?,
        baseLicenceFee = ?,
        baseReplacementFee = ?,
        licenceFee = ?,
        replacementFee = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?`
    )
    .run(
      licenceForm.licenceNumber,
      licenceForm.licenseeName,
      licenceForm.licenseeBusinessName,
      licenceForm.licenseeAddress1,
      licenceForm.licenseeAddress2,
      licenceForm.licenseeCity,
      licenceForm.licenseeProvince,
      licenceForm.licenseePostalCode,
      licenceForm.bankInstitutionNumber,
      licenceForm.bankTransitNumber,
      licenceForm.bankAccountNumber,
      licenceForm.isRenewal ? 1 : 0,
      dateTimeFunctions.dateStringToInteger(licenceForm.startDateString),
      dateTimeFunctions.dateStringToInteger(licenceForm.endDateString),
      licenceForm.baseLicenceFee,
      licenceForm.baseReplacementFee,
      licenceForm.baseLicenceFee, // replace and recalculate
      licenceForm.baseReplacementFee, // replace and recalculate
      requestSession.user.userName,
      rightNowMillis,
      licenceForm.licenceId
    )

  if (licenceForm.licenceFieldKeys) {
    database
      .prepare('delete from LicenceFields where licenceId = ?')
      .run(licenceForm.licenceId)

    const licenceFieldKeys = licenceForm.licenceFieldKeys.split(',')

    saveLicenceFields(
      licenceForm.licenceId,
      licenceFieldKeys,
      licenceForm,
      database
    )
  }

  if (licenceForm.licenceApprovalKeys) {
    database
      .prepare('delete from LicenceApprovals where licenceId = ?')
      .run(licenceForm.licenceId)

    const licenceApprovalKeys = licenceForm.licenceApprovalKeys.split(',')
    saveLicenceApprovals(
      licenceForm.licenceId,
      licenceApprovalKeys,
      licenceForm,
      database
    )
  }

  // Check for additional fees to update
  const currentAdditionalFees = database
    .prepare(
      'select' +
        ' licenceAdditionalFeeKey, additionalFeeType, additionalFeeNumber, additionalFeeFunction' +
        ' from LicenceCategoryAdditionalFees' +
        ' where licenceAdditionalFeeKey in (select licenceAdditionalFeeKey from LicenceAdditionalFees where licenceId = ?)'
    )
    .all(licenceForm.licenceId) as LicenceCategoryAdditionalFee[]

  for (const currentAdditionalFee of currentAdditionalFees) {
    const additionalFeeAmount = licenceFunctions.calculateAdditionalFeeAmount(
      currentAdditionalFee,
      licenceForm.baseLicenceFee
    )

    database
      .prepare(
        'update LicenceAdditionalFees' +
          ' set additionalFeeAmount = ?' +
          ' where licenceId = ?' +
          ' and licenceAdditionalFeeKey = ?'
      )
      .run(
        additionalFeeAmount,
        licenceForm.licenceId,
        currentAdditionalFee.licenceAdditionalFeeKey
      )

    database
      .prepare(
        'update Licences' +
          ' set licenceFee = licenceFee + ?' +
          ' where licenceId = ?'
      )
      .run(additionalFeeAmount.toFixed(2), licenceForm.licenceId)
  }

  // Update bank information on outstanding batch entries
  if (configFunctions.getProperty('settings.includeBatches')) {
    database
      .prepare(
        `update LicenceTransactions
          set bankInstitutionNumber = ?,
          bankTransitNumber = ?,
          bankAccountNumber = ?,
          recordUpdate_userName = ?,
          recordUpdate_timeMillis = ?
          where licenceId = ?
          and recordDelete_timeMillis is null
          and batchDate is not null
          and (externalReceiptNumber is null or externalReceiptNumber = '')
          and (bankInstitutionNumber <> ? or bankTransitNumber <> ? or bankAccountNumber <> ?)`
      )
      .run(
        licenceForm.bankInstitutionNumber,
        licenceForm.bankTransitNumber,
        licenceForm.bankAccountNumber,
        requestSession.user.userName,
        rightNowMillis,
        licenceForm.licenceId,
        licenceForm.bankInstitutionNumber,
        licenceForm.bankTransitNumber,
        licenceForm.bankAccountNumber
      )
  }

  database.close()

  return true
}

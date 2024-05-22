import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export interface UpdateLicenceCategoryAdditionalFeeForm {
  licenceAdditionalFeeKey: string
  additionalFee: string
  additionalFeeType: string
  additionalFeeNumber: string
  additionalFeeFunction?: string
  isRequired?: string
}

export default function updateLicenceCategoryAdditionalFee(
  licenceCategoryAdditionalFeeForm: UpdateLicenceCategoryAdditionalFeeForm,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update LicenceCategoryAdditionalFees
        set additionalFee = ?,
        additionalFeeType = ?,
        additionalFeeNumber = ?,
        additionalFeeFunction = ?,
        isRequired = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceAdditionalFeeKey = ?`
    )
    .run(
      licenceCategoryAdditionalFeeForm.additionalFee,
      licenceCategoryAdditionalFeeForm.additionalFeeType,
      licenceCategoryAdditionalFeeForm.additionalFeeNumber,
      licenceCategoryAdditionalFeeForm.additionalFeeFunction ?? '',
      licenceCategoryAdditionalFeeForm.isRequired ? 1 : 0,
      requestSession.user.userName,
      Date.now(),
      licenceCategoryAdditionalFeeForm.licenceAdditionalFeeKey
    )

  database.close()

  return true
}

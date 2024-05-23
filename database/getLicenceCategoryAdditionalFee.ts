import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type { LicenceCategoryAdditionalFee } from '../types/recordTypes.js'

export default function getLicenceCategoryAdditionalFee(
  licenceAdditionalFeeKey: string,
  database?: sqlite.Database
): LicenceCategoryAdditionalFee | undefined {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const licenceCategoryAdditionalFee = database
    .prepare(
      `select licenceCategoryKey, licenceAdditionalFeeKey,
        additionalFee, additionalFeeType, additionalFeeNumber, additionalFeeFunction,
        isRequired, orderNumber
        from LicenceCategoryAdditionalFees
        where recordDelete_timeMillis is null
        and licenceAdditionalFeeKey = ?`
    )
    .get(licenceAdditionalFeeKey) as LicenceCategoryAdditionalFee

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryAdditionalFee
}

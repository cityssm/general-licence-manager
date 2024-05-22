import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type * as recordTypes from '../../types/recordTypes'

export default function getLicenceCategoryAdditionalFees(
  licenceCategoryKey: string,
  database?: sqlite.Database
): recordTypes.LicenceCategoryAdditionalFee[] {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const licenceCategoryAdditionalFees = database
    .prepare(
      `select licenceCategoryKey, licenceAdditionalFeeKey,
        additionalFee, additionalFeeType, additionalFeeNumber, additionalFeeFunction,
        isRequired, orderNumber
        from LicenceCategoryAdditionalFees
        where recordDelete_timeMillis is null
        and licenceCategoryKey = ?
        order by orderNumber, additionalFee`
    )
    .all(licenceCategoryKey) as recordTypes.LicenceCategoryAdditionalFee[]

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryAdditionalFees
}

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type { LicenceCategoryFee } from '../types/recordTypes.js'

export default function getLicenceCategoryFee(
  licenceFeeId: number | string,
  database?: sqlite.Database
): LicenceCategoryFee | undefined {
  let doCloseDatabase = false

  if (!database) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  database.function(
    'fn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )

  const licenceCategoryFee = database
    .prepare(
      `select licenceFeeId, licenceCategoryKey,
        effectiveStartDate, fn_dateIntegerToString(effectiveStartDate) as effectiveStartDateString,
        effectiveEndDate, fn_dateIntegerToString(effectiveEndDate) as effectiveEndDateString,
        licenceFee, renewalFee, replacementFee
        from LicenceCategoryFees
        where recordDelete_timeMillis is null
        and licenceFeeId = ?`
    )
    .get(licenceFeeId) as LicenceCategoryFee

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryFee
}

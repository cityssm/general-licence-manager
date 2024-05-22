import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type * as recordTypes from '../../types/recordTypes'

export default function getLicenceCategoryFees(
  licenceCategoryKey: string,
  feeType: 'current' | 'all',
  database?: sqlite.Database
): recordTypes.LicenceCategoryFee[] {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const parameters: unknown[] = [licenceCategoryKey]

  if (feeType === 'current') {
    const currentDate = dateTimeFunctions.dateToInteger(new Date())
    parameters.push(currentDate, currentDate)
  }

  database.function(
    'fn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )

  const licenceCategoryFees = database
    .prepare(
      `select licenceFeeId, licenceCategoryKey,
        effectiveStartDate, fn_dateIntegerToString(effectiveStartDate) as effectiveStartDateString,
        effectiveEndDate, fn_dateIntegerToString(effectiveEndDate) as effectiveEndDateString,
        licenceFee, ifnull(renewalFee, licenceFee) as renewalFee, ifnull(replacementFee, licenceFee) as replacementFee
        from LicenceCategoryFees
        where recordDelete_timeMillis is null
        and licenceCategoryKey = ?
        ${
          feeType === 'current'
            ? ' and effectiveStartDate <= ?' +
              ' and (effectiveEndDate is null or effectiveEndDate >= ?)'
            : ''
        } order by effectiveStartDate desc`
    )
    .all(parameters) as recordTypes.LicenceCategoryFee[]

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryFees
}

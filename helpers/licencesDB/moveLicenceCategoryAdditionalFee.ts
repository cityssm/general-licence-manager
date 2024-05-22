import sqlite from 'better-sqlite3'
import type * as expressSession from 'express-session'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { LicenceCategoryAdditionalFee } from '../../types/recordTypes.js'

import getLicenceCategoryAdditionalFee from './getLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFees from './getLicenceCategoryAdditionalFees.js'

const sql = `update LicenceCategoryAdditionalFees
    set orderNumber = ?,
    recordUpdate_userName = ?,
    recordUpdate_timeMillis = ?
    where licenceAdditionalFeeKey = ?`

export default function moveLicenceCategoryAdditionalFee(
  licenceAdditionalFeeKeyFrom: string,
  licenceAdditionalFeeKeyTo: string,
  requestSession: expressSession.Session
): string {
  const database = sqlite(databasePath)

  const licenceCategoryAdditionalFeeFrom = getLicenceCategoryAdditionalFee(
    licenceAdditionalFeeKeyFrom,
    database
  ) as LicenceCategoryAdditionalFee

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(
    licenceCategoryAdditionalFeeFrom.licenceCategoryKey,
    database
  )

  let expectedOrderNumber = 0

  for (const licenceCategoryAdditionalFee of licenceCategoryAdditionalFees) {
    if (
      licenceCategoryAdditionalFee.licenceAdditionalFeeKey ===
      licenceAdditionalFeeKeyFrom
    ) {
      continue
    }

    expectedOrderNumber += 1

    if (
      licenceCategoryAdditionalFee.licenceAdditionalFeeKey ===
      licenceAdditionalFeeKeyTo
    ) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          requestSession.user.userName,
          Date.now(),
          licenceAdditionalFeeKeyFrom
        )

      expectedOrderNumber += 1
    }

    if (licenceCategoryAdditionalFee.orderNumber !== expectedOrderNumber) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          requestSession.user.userName,
          Date.now(),
          licenceCategoryAdditionalFee.licenceAdditionalFeeKey
        )
    }
  }

  database.close()

  return licenceCategoryAdditionalFeeFrom.licenceCategoryKey
}

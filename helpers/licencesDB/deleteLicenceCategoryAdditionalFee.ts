import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export default function deleteLicenceCategoryAdditionalFee(
  licenceAdditionalFeeKey: string,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  const row = database
    .prepare(
      `select licenceId from LicenceAdditionalFees
        where licenceAdditionalFeeKey = ?`
    )
    .get(licenceAdditionalFeeKey)

  if (row === undefined) {
    database
      .prepare(
        `delete from LicenceCategoryAdditionalFees
          where licenceAdditionalFeeKey = ?`
      )
      .run(licenceAdditionalFeeKey)
  } else {
    database
      .prepare(
        `update LicenceCategoryAdditionalFees
          set recordDelete_userName = ?,
          recordDelete_timeMillis = ?
          where licenceAdditionalFeeKey = ?`
      )
      .run(requestSession.user.userName, Date.now(), licenceAdditionalFeeKey)
  }

  database.close()

  return true
}

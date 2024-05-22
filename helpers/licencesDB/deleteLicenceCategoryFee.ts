import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export default function deleteLicenceCategoryFee(
  licenceFeeId: number | string,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update LicenceCategoryFees
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceFeeId = ?`
    )
    .run(requestSession.user.userName, Date.now(), licenceFeeId)

  database.close()

  return true
}

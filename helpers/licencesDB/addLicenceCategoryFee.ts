import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export default function addLicenceCategoryFee(
  licenceCategoryKey: string,
  requestSession: PartialSession
): number {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into LicenceCategoryFees (
        licenceCategoryKey, recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?)`
    )
    .run(
      licenceCategoryKey,
      requestSession.user.userName,
      rightNowMillis,
      requestSession.user.userName,
      rightNowMillis
    )

  database.close()

  return result.lastInsertRowid as number
}

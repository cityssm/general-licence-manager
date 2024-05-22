import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export default function deleteLicence(
  licenceId: number | string,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update Licences
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceId = ?`
    )
    .run(requestSession.user.userName, Date.now(), licenceId)

  database.close()

  return true
}

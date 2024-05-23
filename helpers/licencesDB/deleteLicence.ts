import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'

export default function deleteLicence(
  licenceId: number | string,
  sessionUser: GLMUser
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update Licences
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceId = ?`
    )
    .run(sessionUser.userName, Date.now(), licenceId)

  database.close()

  return true
}

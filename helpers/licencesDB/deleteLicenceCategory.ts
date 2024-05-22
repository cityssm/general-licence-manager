import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

const tablesToPurge = [
  'LicenceCategoryFields',
  'LicenceCategoryApprovals',
  'LicenceCategoryFees',
  'LicenceCategoryAdditionalFees',
  'LicenceCategories'
]

export default function deleteLicenceCategory(
  licenceCategoryKey: string,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  const row = database
    .prepare('select licenceId from Licences where licenceCategoryKey = ?')
    .get(licenceCategoryKey)

  if (row === undefined) {
    for (const tableName of tablesToPurge) {
      database
        .prepare(`delete from ${tableName} where licenceCategoryKey = ?`)
        .run(licenceCategoryKey)
    }
  } else {
    for (const tableName of tablesToPurge) {
      database
        .prepare(
          `update ${tableName}
            set recordDelete_userName = ?,
            recordDelete_timeMillis = ?
            where licenceCategoryKey = ?`
        )
        .run(requestSession.user.userName, Date.now(), licenceCategoryKey)
    }
  }

  database.close()

  return true
}

import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type { LicenceCategoryApproval } from '../types/recordTypes.js'

export default function getLicenceCategoryApproval(
  licenceApprovalKey: string,
  database?: sqlite.Database
): LicenceCategoryApproval {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const licenceCategoryApproval = database
    .prepare(
      `select licenceApprovalKey, licenceCategoryKey,
        licenceApproval, licenceApprovalDescription,
        isRequiredForNew, isRequiredForRenewal,
        printKey
        from LicenceCategoryApprovals
        where recordDelete_timeMillis is null
        and licenceApprovalKey = ?`
    )
    .get(licenceApprovalKey) as LicenceCategoryApproval

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryApproval
}

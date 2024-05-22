import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { LicenceCategoryField } from '../../types/recordTypes.js'

export default function getLicenceCategoryField(
  licenceFieldKey: string,
  database?: sqlite.Database
): LicenceCategoryField | undefined {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const licenceCategoryField = database
    .prepare(
      `select licenceFieldKey, licenceCategoryKey,
        licenceField, licenceFieldDescription,
        isRequired,
        minimumLength, maximumLength, pattern,
        printKey
        from LicenceCategoryFields
        where recordDelete_timeMillis is null
        and licenceFieldKey = ?`
    )
    .get(licenceFieldKey) as LicenceCategoryField

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryField
}

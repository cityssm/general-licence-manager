import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'

export default function saveLicenceFields(
  licenceId: number | string,
  licenceFieldKeys: string[],
  licenceForm: Record<string, string>,
  database?: sqlite.Database
): boolean {
  let doCloseDatabase = false

  if (database === undefined) {
    database = sqlite(databasePath)

    doCloseDatabase = true
  }

  for (const licenceFieldKey of licenceFieldKeys) {
    const licenceFieldValue = licenceForm[`field--${licenceFieldKey}`]

    database
      .prepare(
        'insert into LicenceFields (licenceId, licenceFieldKey, licenceFieldValue) values (?, ?, ?)'
      )
      .run(licenceId, licenceFieldKey, licenceFieldValue)
  }

  if (doCloseDatabase) {
    database.close()
  }

  return true
}

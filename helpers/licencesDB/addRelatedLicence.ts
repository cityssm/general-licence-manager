import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'

export function addRelatedLicence(licenceIdA: number | string,
  licenceIdB: number | string,
  database?: sqlite.Database): boolean {
  let closeDatabase = false

  if (!database) {
    database = sqlite(databasePath)
    closeDatabase = true
  }

  const licenceIdA_number = typeof licenceIdA === 'number'
    ? licenceIdA
    : Number.parseInt(licenceIdA, 10)
  const licenceIdB_number = typeof licenceIdB === 'number'
    ? licenceIdB
    : Number.parseInt(licenceIdB, 10)

  const result = database
    .prepare(
      'insert or ignore into RelatedLicences (licenceIdA, licenceIdB) values (?, ?)'
    )
    .run(
      Math.min(licenceIdA_number, licenceIdB_number),
      Math.max(licenceIdA_number, licenceIdB_number)
    )

  if (closeDatabase) {
    database.close()
  }

  return result.changes > 0
}

export default addRelatedLicence

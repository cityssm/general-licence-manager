import sqlite from 'better-sqlite3'
import { licencesDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export const getLicenceCategoryField = (
  licenceFieldKey: string,
  database?: sqlite.Database
): recordTypes.LicenceCategoryField => {
  let doCloseDatabase = false

  if (!database) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const licenceCategoryField = database
    .prepare(
      'select licenceFieldKey, licenceCategoryKey,' +
        ' licenceField, licenceFieldDescription,' +
        ' isRequired, minimumLength, maximumLength, pattern, printKey' +
        ' from LicenceCategoryFields' +
        ' where recordDelete_timeMillis is null' +
        ' and licenceFieldKey = ?'
    )
    .get(licenceFieldKey) as recordTypes.LicenceCategoryField

  if (doCloseDatabase) {
    database.close()
  }

  return licenceCategoryField
}

export default getLicenceCategoryField

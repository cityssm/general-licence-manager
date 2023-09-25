import sqlite from 'better-sqlite3'
import { licencesDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export const getLicenceFields = (
  licenceId: number | string,
  licenceCategoryKey: string,
  database?: sqlite.Database
): recordTypes.LicenceField[] => {
  let doCloseDatabase = false

  if (!database) {
    database = sqlite(databasePath, {
      readonly: true
    })

    doCloseDatabase = true
  }

  const rows = database
    .prepare(
      'select f.licenceFieldKey, f.licenceFieldValue,' +
        ' c.licenceField, c.licenceFieldDescription,' +
        ' c.isRequired, c.minimumLength, c.maximumLength, c.pattern, c.printKey, c.orderNumber' +
        ' from LicenceFields f' +
        ' left join LicenceCategoryFields c on f.licenceFieldKey = c.licenceFieldKey' +
        ' where f.licenceId = ?' +
        ' union' +
        " select c.licenceFieldKey, '' as licenceFieldValue," +
        ' c.licenceField, c.licenceFieldDescription,' +
        ' c.isRequired, c.minimumLength, c.maximumLength, c.pattern, c.printKey, c.orderNumber' +
        ' from LicenceCategoryFields c' +
        ' where c.recordDelete_timeMillis is null' +
        ' and c.licenceCategoryKey = ?' +
        ' and c.licenceFieldKey not in (select licenceFieldKey from LicenceFields where licenceId = ?)' +
        ' order by c.orderNumber, c.licenceField'
    )
    .all(licenceId, licenceCategoryKey, licenceId) as recordTypes.LicenceField[]

  if (doCloseDatabase) {
    database.close()
  }

  return rows
}

export default getLicenceFields

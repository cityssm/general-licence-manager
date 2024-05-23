import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type { LicenceCategoryField } from '../types/recordTypes.js'

import getLicenceCategoryField from './getLicenceCategoryField.js'
import getLicenceCategoryFields from './getLicenceCategoryFields.js'

const sql = `update LicenceCategoryFields
    set orderNumber = ?,
    recordUpdate_userName = ?,
    recordUpdate_timeMillis = ?
    where licenceFieldKey = ?`

export default function moveLicenceCategoryField(
  licenceFieldKeyFrom: string,
  licenceFieldKeyTo: string,
  sessionUser: GLMUser
): string {
  const database = sqlite(databasePath)

  const licenceCategoryFieldFrom = getLicenceCategoryField(
    licenceFieldKeyFrom,
    database
  ) as LicenceCategoryField

  const licenceCategoryFields = getLicenceCategoryFields(
    licenceCategoryFieldFrom.licenceCategoryKey,
    database
  )

  let expectedOrderNumber = 0

  for (const licenceCategoryField of licenceCategoryFields) {
    if (licenceCategoryField.licenceFieldKey === licenceFieldKeyFrom) {
      continue
    }

    expectedOrderNumber += 1

    if (licenceCategoryField.licenceFieldKey === licenceFieldKeyTo) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          sessionUser.userName,
          Date.now(),
          licenceFieldKeyFrom
        )

      expectedOrderNumber += 1
    }

    if (licenceCategoryField.orderNumber !== expectedOrderNumber) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          sessionUser.userName,
          Date.now(),
          licenceCategoryField.licenceFieldKey
        )
    }
  }

  database.close()

  return licenceCategoryFieldFrom.licenceCategoryKey
}

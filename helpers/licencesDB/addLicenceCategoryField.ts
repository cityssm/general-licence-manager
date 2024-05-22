import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

import { getUnusedLicenceFieldKey } from './getUnusedKey.js'

export interface AddLicenceCategoryFieldForm {
  licenceCategoryKey: string
  licenceField: string
}

export default function addLicenceCategoryField(
  licenceCategoryFieldForm: AddLicenceCategoryFieldForm,
  requestSession: PartialSession
): string {
  const licenceFieldKey = getUnusedLicenceFieldKey(
    licenceCategoryFieldForm.licenceCategoryKey,
    licenceCategoryFieldForm.licenceField
  )

  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  database
    .prepare(
      `insert into LicenceCategoryFields (
        licenceFieldKey, licenceCategoryKey, licenceField,
        recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      licenceFieldKey,
      licenceCategoryFieldForm.licenceCategoryKey,
      licenceCategoryFieldForm.licenceField,
      requestSession.user.userName,
      rightNowMillis,
      requestSession.user.userName,
      rightNowMillis
    )

  database.close()

  return licenceFieldKey
}

import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export interface UpdateLicenceCategoryFieldForm {
  licenceFieldKey: string
  licenceField: string
  licenceFieldDescription: string
  isRequired?: string
  minimumLength: string
  maximumLength: string
  pattern: string
  printKey: string
}

export default function updateLicenceCategoryField(
  licenceCategoryFieldForm: UpdateLicenceCategoryFieldForm,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update LicenceCategoryFields
        set licenceField = ?,
        licenceFieldDescription = ?,
        isRequired = ?,
        minimumLength = ?,
        maximumLength = ?,
        pattern = ?,
        printKey = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceFieldKey = ?`
    )
    .run(
      licenceCategoryFieldForm.licenceField,
      licenceCategoryFieldForm.licenceFieldDescription,
      licenceCategoryFieldForm.isRequired ? 1 : 0,
      licenceCategoryFieldForm.minimumLength,
      licenceCategoryFieldForm.maximumLength,
      licenceCategoryFieldForm.pattern,
      licenceCategoryFieldForm.printKey,
      requestSession.user.userName,
      Date.now(),
      licenceCategoryFieldForm.licenceFieldKey
    )

  database.close()

  return true
}

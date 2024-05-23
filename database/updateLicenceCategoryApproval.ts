import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'

export interface UpdateLicenceCategoryApprovalForm {
  licenceApprovalKey: string
  licenceApproval: string
  licenceApprovalDescription: string
  isRequiredForNew?: string
  isRequiredForRenewal?: string
  printKey: string
}

export default function updateLicenceCategoryApproval(
  licenceCategoryApprovalForm: UpdateLicenceCategoryApprovalForm,
  sessionUser: GLMUser
): boolean {
  const database = sqlite(databasePath)

  database
    .prepare(
      `update LicenceCategoryApprovals
        set licenceApproval = ?,
        licenceApprovalDescription = ?,
        isRequiredForNew = ?,
        isRequiredForRenewal = ?,
        printKey = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceApprovalKey = ?`
    )
    .run(
      licenceCategoryApprovalForm.licenceApproval,
      licenceCategoryApprovalForm.licenceApprovalDescription,
      licenceCategoryApprovalForm.isRequiredForNew ? 1 : 0,
      licenceCategoryApprovalForm.isRequiredForRenewal ? 1 : 0,
      licenceCategoryApprovalForm.printKey,
      sessionUser.userName,
      Date.now(),
      licenceCategoryApprovalForm.licenceApprovalKey
    )

  database.close()

  return true
}

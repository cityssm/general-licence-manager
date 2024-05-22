import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

import getLicenceCategoryApproval from './getLicenceCategoryApproval.js'
import { getLicenceCategoryApprovals } from './getLicenceCategoryApprovals.js'

const sql = `update LicenceCategoryApprovals
    set orderNumber = ?,
    recordUpdate_userName = ?,
    recordUpdate_timeMillis = ?
    where licenceApprovalKey = ?`

export const moveLicenceCategoryApproval = (
  licenceApprovalKeyFrom: string,
  licenceApprovalKeyTo: string,
  requestSession: PartialSession
): string => {
  const database = sqlite(databasePath)

  const licenceCategoryApprovalFrom = getLicenceCategoryApproval(
    licenceApprovalKeyFrom,
    database
  )

  const licenceCategoryApprovals = getLicenceCategoryApprovals(
    licenceCategoryApprovalFrom.licenceCategoryKey,
    database
  )

  let expectedOrderNumber = 0

  for (const licenceCategoryApproval of licenceCategoryApprovals) {
    if (licenceCategoryApproval.licenceApprovalKey === licenceApprovalKeyFrom) {
      continue
    }

    expectedOrderNumber += 1

    if (licenceCategoryApproval.licenceApprovalKey === licenceApprovalKeyTo) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          requestSession.user.userName,
          Date.now(),
          licenceApprovalKeyFrom
        )

      expectedOrderNumber += 1
    }

    if (licenceCategoryApproval.orderNumber !== expectedOrderNumber) {
      database
        .prepare(sql)
        .run(
          expectedOrderNumber,
          requestSession.user.userName,
          Date.now(),
          licenceCategoryApproval.licenceApprovalKey
        )
    }
  }

  database.close()

  return licenceCategoryApprovalFrom.licenceCategoryKey
}

export default moveLicenceCategoryApproval

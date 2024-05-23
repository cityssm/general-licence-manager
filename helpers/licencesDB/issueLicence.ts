import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'

export function issueLicenceWithDate(
  licenceId: number | string,
  issueDate: Date,
  sessionUser: GLMUser
): boolean {
  const database = sqlite(databasePath)

  const rightNow = new Date()

  database
    .prepare(
      `update Licences
        set issueDate = ?,
        issueTime = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?`
    )
    .run(
      dateTimeFunctions.dateToInteger(issueDate),
      dateTimeFunctions.dateToTimeInteger(issueDate),
      sessionUser.userName,
      rightNow.getTime(),
      licenceId
    )

  database.close()

  return true
}

export default function issueLicence(
  licenceId: number | string,
  sessionUser: GLMUser
): boolean {
  return issueLicenceWithDate(licenceId, new Date(), sessionUser)
}

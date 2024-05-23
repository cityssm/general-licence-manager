import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type { LicenceTransaction } from '../types/recordTypes.js'

export default function getOutstandingBatchTransactions(): LicenceTransaction[] {
  const database = sqlite(databasePath, {
    readonly: true
  })

  database.function(
    'userFn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )
  database.function(
    'userFn_timeIntegerToString',
    dateTimeFunctions.timeIntegerToString
  )

  const rows = database
    .prepare(
      `select licenceId, transactionIndex,
          bankTransitNumber, bankInstitutionNumber, bankAccountNumber,
          batchDate, userFn_dateIntegerToString(batchDate) as batchDateString,
          transactionAmount
          from LicenceTransactions
          where recordDelete_timeMillis is null
          and licenceId in (select licenceId from Licences where recordDelete_timeMillis is null)
          and batchDate is not null
          and (externalReceiptNumber is null or externalReceiptNumber = '')
          order by licenceId, batchDate`
    )
    .all() as LicenceTransaction[]

  database.close()

  return rows
}

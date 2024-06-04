import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import getCanadianBankName from '@cityssm/get-canadian-bank-name'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'
import type * as recordTypes from '../types/recordTypes.js'

export const getBatchTransactions = (
  batchDate: number | string,
  includeOutstandingOnly = false
): recordTypes.LicenceTransaction[] => {
  const database = sqlite(databasePath, {
    readonly: true
  })

  database.function(
    'userFn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )
  database.function('userFn_getCanadianBankName', getCanadianBankName)

  const rows = database
    .prepare(
      `select l.licenceId, l.licenceNumber,
        c.licenceCategory, l.licenseeName, l.licenseeBusinessName,
        t.transactionIndex,
        t.transactionDate, userFn_dateIntegerToString(t.transactionDate) as transactionDateString,
        t.batchDate, userFn_dateIntegerToString(t.batchDate) as batchDateString,
        t.bankTransitNumber, t.bankInstitutionNumber, t.bankAccountNumber,
        userFn_getCanadianBankName(t.bankInstitutionNumber, t.bankTransitNumber) as bankName,
        t.externalReceiptNumber, t.transactionAmount, t.transactionNote
        from LicenceTransactions t
        left join Licences l on t.licenceId = l.licenceId
        left join licenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey
        where t.recordDelete_timeMillis is null
        and l.recordDelete_timeMillis is null
        and t.batchDate = ?
        ${
          includeOutstandingOnly
            ? " and (t.externalReceiptNumber is null or t.externalReceiptNumber = '')"
            : ''
        }
        order by l.licenceNumber`
    )
    .all(batchDate) as recordTypes.LicenceTransaction[]

  database.close()

  return rows
}

export default getBatchTransactions

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { Licence } from '../../types/recordTypes.js'

export default function getBatchableLicences(): Licence[] {
  const database = sqlite(databasePath, {
    readonly: true
  })

  database.function(
    'userFn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )

  const rows = database
    .prepare(
      `select l.licenceId, l.licenceCategoryKey,
        l.licenceNumber, l.licenseeName, l.licenseeBusinessName,
        l.licenseeAddress1, l.licenseeAddress2, l.licenseeCity, l.licenseeProvince, l.licenseePostalCode,
        l.bankInstitutionNumber, l.bankTransitNumber, l.bankAccountNumber,
        l.startDate, l.endDate, l.issueDate, l.licenceFee,
        (l.licenceFee - ifnull(t.transactionAmount_confirmedSum, 0)) as outstandingBalance
        from Licences l
        left join (
          select licenceId, sum(transactionAmount) as transactionAmount_confirmedSum
          from LicenceTransactions
          where recordDelete_timeMillis is null
          and (batchDate is null or (batchDate is not null and externalReceiptNumber <> ''))
          group by licenceId
        ) t on l.licenceId = t.licenceId
        where l.recordDelete_timeMillis is null
        and l.issueDate is not null
        and l.licenceFee > ifnull(t.transactionAmount_confirmedSum, 0)
        order by l.licenceNumber`
    )
    .all() as Licence[]

  database.close()

  return rows
}

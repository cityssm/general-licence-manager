import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

export interface MarkBatchTransactionSuccessfulForm {
  licenceId: string
  transactionIndex: string
  transactionAmount: string
  batchDate: string
  externalReceiptNumber: string
}

export default function markBatchTransactionSuccessful(
  transaction: MarkBatchTransactionSuccessfulForm,
  requestSession: PartialSession
): boolean {
  const database = sqlite(databasePath)

  const result = database
    .prepare(
      `update LicenceTransactions
        set transactionAmount = ?,
        transactionNote = '',
        externalReceiptNumber = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?
        and transactionIndex = ?
        and batchDate = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      transaction.transactionAmount,
      transaction.externalReceiptNumber,
      requestSession.user.userName,
      Date.now(),
      transaction.licenceId,
      transaction.transactionIndex,
      transaction.batchDate
    )

  database.close()

  return result.changes > 0
}

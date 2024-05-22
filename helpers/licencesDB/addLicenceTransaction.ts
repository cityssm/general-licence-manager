// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type { PartialSession } from '../../types/recordTypes.js'

import getNextLicenceTransactionIndex from './getNextLicenceTransactionIndex.js'

export interface AddLicenceTransactionForm {
  licenceId: number | string
  transactionAmount: number | string
  transactionDateString?: string
  includeInBatch?: string
  bankTransitNumber: string
  bankInstitutionNumber?: string
  bankAccountNumber?: string
  externalReceiptNumber: string
  transactionNote: string
}

export default function addLicenceTransaction(
  licenceTransactionForm: AddLicenceTransactionForm,
  requestSession: PartialSession
): number {
  const database = sqlite(databasePath)

  const rightNow = new Date()

  const transactionIndex = getNextLicenceTransactionIndex(
    licenceTransactionForm.licenceId,
    database
  )

  const transactionDate =
    licenceTransactionForm.transactionDateString &&
    licenceTransactionForm.transactionDateString !== ''
      ? dateTimeFunctions.dateStringToInteger(
          licenceTransactionForm.transactionDateString
        )
      : dateTimeFunctions.dateToInteger(rightNow)

  database
    .prepare(
      `insert into LicenceTransactions (
        licenceId, transactionIndex,
        transactionDate, transactionTime, batchDate,
        bankTransitNumber, bankInstitutionNumber, bankAccountNumber,
        externalReceiptNumber, transactionAmount, transactionNote,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      licenceTransactionForm.licenceId,
      transactionIndex,
      transactionDate,
      licenceTransactionForm.transactionDateString &&
        licenceTransactionForm.transactionDateString !== ''
        ? 0
        : dateTimeFunctions.dateToTimeInteger(rightNow),
      licenceTransactionForm.includeInBatch &&
        licenceTransactionForm.includeInBatch !== ''
        ? transactionDate
        : undefined,
      licenceTransactionForm.bankTransitNumber,
      licenceTransactionForm.bankInstitutionNumber,
      licenceTransactionForm.bankAccountNumber,
      licenceTransactionForm.externalReceiptNumber,
      licenceTransactionForm.transactionAmount,
      licenceTransactionForm.transactionNote,
      requestSession.user.userName,
      rightNow.getTime(),
      requestSession.user.userName,
      rightNow.getTime()
    )

  database.close()

  return transactionIndex
}

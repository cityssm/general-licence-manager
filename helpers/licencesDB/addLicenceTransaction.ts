import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddLicenceTransactionForm {
  licenceId: number | string;
  transactionAmount: number | string;
  transactionDateString?: string;
  bankTransitNumber: string;
  bankInstitutionNumber?: string;
  bankAccountNumber?: string;
  externalReceiptNumber: string;
  transactionNote: string;
}

export const addLicenceTransaction =
  (licenceTransactionForm: AddLicenceTransactionForm, requestSession: recordTypes.PartialSession): number => {

    const database = sqlite(databasePath);

    let transactionIndex = 0;

    const row: { transactionIndex: number } = database.prepare("select transactionIndex" +
      " from LicenceTransactions" +
      " where licenceId = ?" +
      " order by transactionIndex desc" +
      " limit 1")
      .get(licenceTransactionForm.licenceId);

    if (row) {
      transactionIndex = row.transactionIndex + 1;
    }

    const rightNow = new Date();

    database
      .prepare("insert into LicenceTransactions" +
        "(licenceId, transactionIndex," +
        " transactionDate, transactionTime," +
        " bankTransitNumber, bankInstitutionNumber, bankAccountNumber," +
        " externalReceiptNumber, transactionAmount, transactionNote," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(licenceTransactionForm.licenceId,
        transactionIndex,
        licenceTransactionForm.transactionDateString
          ? dateTimeFunctions.dateStringToInteger(licenceTransactionForm.transactionDateString)
          : dateTimeFunctions.dateToInteger(rightNow),
        licenceTransactionForm.transactionDateString
          ? 0
          : dateTimeFunctions.dateToTimeInteger(rightNow),
        licenceTransactionForm.bankTransitNumber,
        licenceTransactionForm.bankInstitutionNumber,
        licenceTransactionForm.bankAccountNumber,
        licenceTransactionForm.externalReceiptNumber,
        licenceTransactionForm.transactionAmount,
        licenceTransactionForm.transactionNote,
        requestSession.user.userName,
        rightNow.getTime(),
        requestSession.user.userName,
        rightNow.getTime());

    database.close();

    return transactionIndex;
  };


export default addLicenceTransaction;

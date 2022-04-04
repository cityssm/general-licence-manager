import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface TransactionForm {
  licenceId: string;
  transactionIndex: string;
  transactionAmount: string;
  batchDate: string;
  externalReceiptNumber: string;
}

export const markBatchTransactionSuccessful = (transaction: TransactionForm, requestSession: recordTypes.PartialSession): boolean => {

  const database = sqlite(databasePath);

  const result =
    database.prepare("update LicenceTransactions" +
      " set transactionAmount = ?," +
      " transactionNote = ''," +
      " externalReceiptNumber = ?," +
      " recordUpdate_userName = ?," +
      " recordUpdate_timeMillis = ?" +
      " where licenceId = ?" +
      " and transactionIndex = ?" +
      " and batchDate = ?" +
      " and recordDelete_timeMillis is null")
      .run(transaction.transactionAmount,
        transaction.externalReceiptNumber,
        requestSession.user.userName,
        Date.now(),
        transaction.licenceId,
        transaction.transactionIndex,
        transaction.batchDate);

  database.close();

  return result.changes > 0;
};


export default markBatchTransactionSuccessful;

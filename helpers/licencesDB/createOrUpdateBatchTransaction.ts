import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as configFunctions from "../functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getNextLicenceTransactionIndex } from "./getNextLicenceTransactionIndex.js";

import type * as recordTypes from "../../types/recordTypes";

interface TransactionForm {
  licenceId: string;
  batchDateString: string;
  transactionAmount: string;
}

interface CreateOrUpdateBatchTransactionReturn {
  success: boolean;
  message?: string;
  transactionIndex?: number;
  batchTransactions?: recordTypes.LicenceTransaction[];
}

export const createOrUpdateBatchTransaction =
  (transactionForm: TransactionForm, requestSession: recordTypes.PartialSession): CreateOrUpdateBatchTransactionReturn => {

    const database = sqlite(databasePath);

    // Get current bank numbers

    let message: string;

    const bankRecord: {
      bankInstitutionNumber?: string;
      bankTransitNumber?: string;
      bankAccountNumber?: string;
    } = database.prepare("select" +
      " bankInstitutionNumber, bankTransitNumber, bankAccountNumber" +
      " from Licences" +
      " where recordDelete_timeMillis is null" +
      " and licenceId = ?" +
      " and issueDate is not null")
      .get(transactionForm.licenceId);

    if (!bankRecord) {

      database.close();

      return {
        success: false,
        message: configFunctions.getProperty("settings.licenceAlias") + " is not available for updates (licenceId = " + transactionForm.licenceId + ")."
      }
    } else if (!bankRecord.bankInstitutionNumber || bankRecord.bankInstitutionNumber === "" ||
      !bankRecord.bankTransitNumber || bankRecord.bankTransitNumber === "" ||
      !bankRecord.bankAccountNumber || bankRecord.bankAccountNumber === "") {

      message = "Banking information is incomplete on the " + configFunctions.getProperty("settings.licenceAlias").toLowerCase() + ".";
    }

    // Look for an existing batch transaction

    const batchDate = dateTimeFunctions.dateStringToInteger(transactionForm.batchDateString);

    const currentTransactionRecord: {
      transactionCount?: number;
      transactionIndexMin?: number;
      externalReceiptNumberMax?: string;
    } = database.prepare("select count(transactionIndex) as transactionCount," +
      " min(transactionIndex) as transactionIndexMin," +
      " max(externalReceiptNumber) as externalReceiptNumberMax" +
      " from LicenceTransactions" +
      " where recordCreate_timeMillis is not null" +
      " and licenceId = ?" +
      " and batchDate = ?")
      .get(transactionForm.licenceId, batchDate);

    // Save transaction

    let runResult: sqlite.RunResult;
    const doDelete = transactionForm.transactionAmount === "" || Number.parseFloat(transactionForm.transactionAmount) === 0;

    const rightNowMillis = Date.now();
    let transactionIndex: number;

    if (currentTransactionRecord) {
      // Do Update

      transactionIndex = currentTransactionRecord.transactionIndexMin;

      if (currentTransactionRecord.externalReceiptNumberMax && currentTransactionRecord.externalReceiptNumberMax !== "") {

        database.close();

        return {
          success: false,
          message: "The transaction has already been processed and cannot be updated.",
          transactionIndex
        };
      } else if (doDelete) {

        runResult = database.prepare("update LicenceTransactions" +
          " set transactionAmount = 0," +
          " recordDelete_userName = ?, " +
          " recordDelete_timeMillis = ?" +
          " where licenceId = ?" +
          " and transactionIndex = ?"
        ).run(requestSession.user.userName,
          rightNowMillis,
          transactionForm.licenceId,
          transactionIndex);

      } else {

        if (currentTransactionRecord.transactionCount > 1) {

          database.prepare("update LicenceTransactions" +
            " set transactionAmount = 0," +
            " recordDelete_userName = ?, " +
            " recordDelete_timeMillis = ?" +
            " where licenceId = ?" +
            " and batchDate = ?" +
            " and transactionIndex <> ?"
          ).run(requestSession.user.userName,
            rightNowMillis,
            transactionForm.licenceId,
            batchDate,
            transactionIndex);
        }

        runResult = database.prepare("update LicenceTransactions" +
          " set bankInstitutionNumber = ?," +
          " bankTransitNumber = ?," +
          " bankAccountNumber = ?," +
          " transactionAmount = ?," +
          " recordUpdate_userName = ?," +
          " recordUpdate_timeMillis = ?," +
          " recordDelete_userName = null," +
          " recordDelete_timeMillis = null" +
          " where licenceId = ?" +
          " and transactionIndex = ?")
          .run(bankRecord.bankInstitutionNumber,
            bankRecord.bankTransitNumber,
            bankRecord.bankAccountNumber,
            transactionForm.transactionAmount,
            requestSession.user.userName,
            rightNowMillis,
            transactionForm.licenceId,
            transactionIndex);
      }

    } else if (!doDelete) {
      // Do Insert

      transactionIndex = getNextLicenceTransactionIndex(transactionForm.licenceId, database);

      runResult = database.prepare("insert into LicenceTransactions" +
        " (licenceId, transactionIndex, transactionDate, transactionTime," +
        " bankInstitutionNumber, bankTransitNumber, bankAccountNumber," +
        " batchDate, transactionAmount," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(
          transactionForm.licenceId,
          transactionIndex,
          batchDate,
          0,
          bankRecord.bankInstitutionNumber,
          bankRecord.bankTransitNumber,
          bankRecord.bankAccountNumber,
          batchDate,
          transactionForm.transactionAmount,
          requestSession.user.userName,
          rightNowMillis,
          requestSession.user.userName,
          rightNowMillis);
    }

    database.close();

    return {
      success: (runResult ? runResult.changes > 0 : doDelete),
      message,
      transactionIndex
    }
  };


export default createOrUpdateBatchTransaction;

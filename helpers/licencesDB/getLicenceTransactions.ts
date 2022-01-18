import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceTransactions = (licenceId: number | string, database?: sqlite.Database): recordTypes.LicenceTransaction[] => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
  database.function("userFn_timeIntegerToString", dateTimeFunctions.timeIntegerToString);

  const rows: recordTypes.LicenceTransaction[] =
    database.prepare("select transactionIndex," +
      " transactionDate, userFn_dateIntegerToString(transactionDate) as transactionDateString," +
      " transactionTime, userFn_timeIntegerToString(transactionTime) as transactionTimeString," +
      " externalReceiptNumber, transactionAmount, transactionNote" +
      " from LicenceTransactions" +
      " where recordDelete_timeMillis is null" +
      " and licenceId = ?")
      .all(licenceId);

  if (doCloseDatabase) {
    database.close();
  }

  return rows;
};


export default getLicenceTransactions;

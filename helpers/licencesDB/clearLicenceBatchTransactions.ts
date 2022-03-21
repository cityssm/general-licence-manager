import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const clearLicenceBatchTransactions =
  (licenceId: number | string, requestSession: recordTypes.PartialSession): boolean => {

    const database = sqlite(databasePath);

    database.prepare("update LicenceTransactions" +
      " set transactionAmount = 0," +
      " recordDelete_userName = ?, " +
      " recordDelete_timeMillis = ?" +
      " where licenceId = ?" +
      " and batchDate is not null" +
      " and (externalReceiptNumber is null or externalReceiptNumber = '')" +
      " and recordDelete_timeMillis is null"
    ).run(requestSession.user.userName,
      Date.now(),
      licenceId);

    database.close();

    return true;
  };


export default clearLicenceBatchTransactions;

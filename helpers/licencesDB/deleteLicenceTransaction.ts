import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


export const deleteLicenceTransaction =
  (licenceId: number | string, transactionIndex: number | string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    database.prepare("update LicenceTransactions" +
      " set recordDelete_userName = ?," +
      " recordDelete_timeMillis = ?" +
      " where licenceId = ?" +
      " and transactionIndex = ?")
      .run(requestSession.user.userName,
        Date.now(),
        licenceId,
        transactionIndex);

    database.close();

    return true;
  };


export default deleteLicenceTransaction;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


export const addLicenceCategoryFee =
  (licenceCategoryKey: string, requestSession: expressSession.Session): number => {

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
      .prepare("insert into LicenceCategoryFees" +
        "(licenceCategoryKey," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?)")
      .run(licenceCategoryKey,
        requestSession.user.userName,
        rightNowMillis,
        requestSession.user.userName,
        rightNowMillis);

    database.close();

    return result.lastInsertRowid as number;
  };


export default addLicenceCategoryFee;

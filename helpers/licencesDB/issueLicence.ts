import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as expressSession from "express-session";


export const issueLicence =
  (licenceId: number | string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    const rightNow = new Date();

    database
      .prepare("update Licences" +
        " set issueDate = ?," +
        " issueTime = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceId = ?")
      .run(dateTimeFunctions.dateToInteger(rightNow),
        dateTimeFunctions.dateToTimeInteger(rightNow),
        requestSession.user.userName,
        rightNow.getTime(),
        licenceId);

    database.close();

    return true;
  };


export default issueLicence;

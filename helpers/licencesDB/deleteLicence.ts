import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


export const deleteLicence =
  (licenceId: number | string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    database.prepare("update Licences" +
      " set recordDelete_userName = ?," +
      " recordDelete_timeMillis = ?" +
      " where licenceId = ?")
      .run(requestSession.user.userName,
        Date.now(),
        licenceId);

    database.close();

    return true;
  };


export default deleteLicence;

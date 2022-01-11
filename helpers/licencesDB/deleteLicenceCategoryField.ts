import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


export const deleteLicenceCategoryField =
  (licenceFieldKey: string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    const row = database
      .prepare("select licenceId from LicenceFields" +
        " where licenceFieldKey = ?")
      .get(licenceFieldKey);

    if (row) {

      database.prepare("update LicenceCategoryFields" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where licenceFieldKey = ?")
        .run(requestSession.user.userName,
          Date.now(),
          licenceFieldKey);

    } else {

      database.prepare("delete from LicenceCategoryFields" +
        " where licenceFieldKey = ?")
        .run(licenceFieldKey);
    }

    database.close();

    return true;
  };


export default deleteLicenceCategoryField;

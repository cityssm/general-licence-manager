import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


const tablesToPurge = ["LicenceCategoryFields",
  "LicenceCategoryApprovals",
  "LicenceCategoryFees",
  "LicenceCategoryAdditionalFees",
  "LicenceCategories"];


export const deleteLicenceCategory =
  (licenceCategoryKey: string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    const row = database
      .prepare("select licenceId from Licences" +
        " where licenceCategoryKey = ?")
      .get(licenceCategoryKey);

    if (row) {

      for (const tableName of tablesToPurge) {
        database.prepare("update " + tableName +
          " set recordDelete_userName = ?," +
          " recordDelete_timeMillis = ?" +
          " where licenceCategoryKey = ?")
          .run(requestSession.user.userName,
            Date.now(),
            licenceCategoryKey);
      }

    } else {

      for (const tableName of tablesToPurge) {
        database.prepare("delete from " + tableName +
          " where licenceCategoryKey = ?")
          .run(licenceCategoryKey);
      }
    }

    database.close();

    return true;
  };


export default deleteLicenceCategory;

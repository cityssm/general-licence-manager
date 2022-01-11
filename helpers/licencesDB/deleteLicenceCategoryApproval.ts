import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";


export const deleteLicenceCategoryApproval =
  (licenceApprovalKey: string, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    const row = database
      .prepare("select licenceId from LicenceApprovals" +
        " where licenceApprovalKey = ?")
      .get(licenceApprovalKey);

    if (row) {

      database.prepare("update LicenceCategoryApprovals" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where licenceApprovalKey = ?")
        .run(requestSession.user.userName,
          Date.now(),
          licenceApprovalKey);

    } else {

      database.prepare("delete from LicenceCategoryApprovals" +
        " where licenceApprovalKey = ?")
        .run(licenceApprovalKey);
    }

    database.close();

    return true;
  };


export default deleteLicenceCategoryApproval;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceCategoryApprovals = (licenceCategoryKey: string, database?: sqlite.Database): recordTypes.LicenceCategoryApproval[] => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  const licenceCategoryApprovals: recordTypes.LicenceCategoryApproval[] =
    database.prepare("select licenceApprovalKey, licenceApproval, licenceApprovalDescription," +
      " isRequiredForNew, isRequiredForRenewal" +
      " from LicenceCategoryApprovals" +
      " where recordDelete_timeMillis is null" +
      " and licenceCategoryKey = ?" +
      " order by orderNumber, licenceApproval")
      .all(licenceCategoryKey);

  if (doCloseDatabase) {
    database.close();
  }

  return licenceCategoryApprovals;
};


export default getLicenceCategoryApprovals;

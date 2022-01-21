import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceCategoryApproval = (licenceApprovalKey: string, database?: sqlite.Database): recordTypes.LicenceCategoryApproval => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  const licenceCategoryApproval: recordTypes.LicenceCategoryApproval =
    database.prepare("select licenceApprovalKey, licenceCategoryKey," +
      " licenceApproval, licenceApprovalDescription," +
      " isRequiredForNew, isRequiredForRenewal, printKey" +
      " from LicenceCategoryApprovals" +
      " where recordDelete_timeMillis is null" +
      " and licenceApprovalKey = ?")
      .get(licenceApprovalKey);

  if (doCloseDatabase) {
    database.close();
  }

  return licenceCategoryApproval;
};


export default getLicenceCategoryApproval;

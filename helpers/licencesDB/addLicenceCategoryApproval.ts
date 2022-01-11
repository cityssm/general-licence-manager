import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getUnusedLicenceApprovalKey } from "./getUnusedKey.js";

import type * as expressSession from "express-session";

interface AddLicenceCategoryApprovalForm {
  licenceCategoryKey: string;
  licenceApproval: string;
}

export const addLicenceCategoryApproval =
  (licenceCategoryApprovalForm: AddLicenceCategoryApprovalForm, requestSession: expressSession.Session): string => {

    const licenceApprovalKey =
      getUnusedLicenceApprovalKey(licenceCategoryApprovalForm.licenceCategoryKey, licenceCategoryApprovalForm.licenceApproval);

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    database
      .prepare("insert into LicenceCategoryApprovals" +
        "(licenceApprovalKey, licenceCategoryKey, licenceApproval," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?)")
      .run(licenceApprovalKey,
        licenceCategoryApprovalForm.licenceCategoryKey,
        licenceCategoryApprovalForm.licenceApproval,
        requestSession.user.userName,
        rightNowMillis,
        requestSession.user.userName,
        rightNowMillis);

    database.close();

    return licenceApprovalKey;
  };


export default addLicenceCategoryApproval;

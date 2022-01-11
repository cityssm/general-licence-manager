import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getLicenceCategoryApproval } from "./getLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "./getLicenceCategoryApprovals.js";

import type * as expressSession from "express-session";


const sql = "update LicenceCategoryApprovals" +
  " set orderNumber = ?," +
  " recordUpdate_userName = ?," +
  " recordUpdate_timeMillis = ?" +
  " where licenceApprovalKey = ?";


export const moveLicenceCategoryApproval =
  (licenceApprovalKey_from: string, licenceApprovalKey_to: string, requestSession: expressSession.Session): string => {

    const database = sqlite(databasePath);

    const licenceCategoryApproval_from = getLicenceCategoryApproval(licenceApprovalKey_from, database);

    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval_from.licenceCategoryKey, database);

    let expectedOrderNumber = 0;

    for (const licenceCategoryApproval of licenceCategoryApprovals) {

      if (licenceCategoryApproval.licenceApprovalKey === licenceApprovalKey_from) {
        continue;
      }

      expectedOrderNumber += 1;

      if (licenceCategoryApproval.licenceApprovalKey === licenceApprovalKey_to) {
        database.prepare(sql)
          .run(expectedOrderNumber,
            requestSession.user.userName,
            Date.now(),
            licenceApprovalKey_from);

        expectedOrderNumber += 1;
      }

      if (licenceCategoryApproval.orderNumber !== expectedOrderNumber) {
        database.prepare(sql)
          .run(expectedOrderNumber,
            requestSession.user.userName,
            Date.now(),
            licenceCategoryApproval.licenceApprovalKey);
      }
    }

    database.close();

    return licenceCategoryApproval_from.licenceCategoryKey;
  };


export default moveLicenceCategoryApproval;

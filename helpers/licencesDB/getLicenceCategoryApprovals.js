import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const getLicenceCategoryApprovals = (licenceCategoryKey, database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryApprovals = database.prepare("select licenceApprovalKey, licenceApproval, licenceApprovalDescription," +
        " isRequiredForNew, isRequiredForRenewal, printKey" +
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

import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
export default function getLicenceCategoryApproval(licenceApprovalKey, database) {
    let doCloseDatabase = false;
    if (database === undefined) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryApproval = database
        .prepare(`select licenceApprovalKey, licenceCategoryKey,
        licenceApproval, licenceApprovalDescription,
        isRequiredForNew, isRequiredForRenewal,
        printKey
        from LicenceCategoryApprovals
        where recordDelete_timeMillis is null
        and licenceApprovalKey = ?`)
        .get(licenceApprovalKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryApproval;
}

import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
export default function deleteLicenceCategoryApproval(licenceApprovalKey, sessionUser) {
    const database = sqlite(databasePath);
    const row = database
        .prepare('select licenceId from LicenceApprovals where licenceApprovalKey = ?')
        .get(licenceApprovalKey);
    if (row === undefined) {
        database
            .prepare('delete from LicenceCategoryApprovals where licenceApprovalKey = ?')
            .run(licenceApprovalKey);
    }
    else {
        database
            .prepare(`update LicenceCategoryApprovals
          set recordDelete_userName = ?,
          recordDelete_timeMillis = ?
          where licenceApprovalKey = ?`)
            .run(sessionUser.userName, Date.now(), licenceApprovalKey);
    }
    database.close();
    return true;
}

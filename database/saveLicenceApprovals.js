import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
export default function saveLicenceApprovals(licenceId, licenceApprovalKeys, licenceForm, database) {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath);
        doCloseDatabase = true;
    }
    for (const licenceApprovalKey of licenceApprovalKeys) {
        if (licenceForm[`approval--${licenceApprovalKey}`]) {
            database
                .prepare('insert into LicenceApprovals (licenceId, licenceApprovalKey) values (?, ?)')
                .run(licenceId, licenceApprovalKey);
        }
    }
    if (doCloseDatabase) {
        database.close();
    }
    return true;
}

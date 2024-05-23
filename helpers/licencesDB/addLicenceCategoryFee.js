import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function addLicenceCategoryFee(licenceCategoryKey, sessionUser) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into LicenceCategoryFees (
        licenceCategoryKey, recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?)`)
        .run(licenceCategoryKey, sessionUser.userName, rightNowMillis, sessionUser.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
}

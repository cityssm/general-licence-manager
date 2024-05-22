import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function deleteLicenceCategoryFee(licenceFeeId, requestSession) {
    const database = sqlite(databasePath);
    database
        .prepare(`update LicenceCategoryFees
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceFeeId = ?`)
        .run(requestSession.user.userName, Date.now(), licenceFeeId);
    database.close();
    return true;
}

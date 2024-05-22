import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function deleteLicenceTransaction(licenceId, transactionIndex, requestSession) {
    const database = sqlite(databasePath);
    database
        .prepare(`update LicenceTransactions
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceId = ?
        and transactionIndex = ?`)
        .run(requestSession.user.userName, Date.now(), licenceId, transactionIndex);
    database.close();
    return true;
}

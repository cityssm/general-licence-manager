import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function clearBatchTransactionsByLicence(licenceId, sessionUser) {
    const database = sqlite(databasePath);
    database
        .prepare(`update LicenceTransactions
        set transactionAmount = 0,
        recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where licenceId = ?
        and batchDate is not null
        and (externalReceiptNumber is null or externalReceiptNumber = '')
        and recordDelete_timeMillis is null`)
        .run(sessionUser.userName, Date.now(), licenceId);
    database.close();
    return true;
}

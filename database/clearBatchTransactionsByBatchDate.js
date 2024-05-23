import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
export default function clearBatchTransactionsByBatchDate(batchDateString, sessionUser) {
    const database = sqlite(databasePath);
    const batchDate = dateTimeFunctions.dateStringToInteger(batchDateString);
    database
        .prepare(`update LicenceTransactions
        set transactionAmount = 0,
        recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where batchDate = ?
        and (externalReceiptNumber is null or externalReceiptNumber = '')
        and recordDelete_timeMillis is null`)
        .run(sessionUser.userName, Date.now(), batchDate);
    database.close();
    return true;
}

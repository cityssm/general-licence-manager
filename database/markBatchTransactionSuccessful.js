import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
export default function markBatchTransactionSuccessful(transaction, sessionUser) {
    const database = sqlite(databasePath);
    const result = database
        .prepare(`update LicenceTransactions
        set transactionAmount = ?,
        transactionNote = '',
        externalReceiptNumber = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?
        and transactionIndex = ?
        and batchDate = ?
        and recordDelete_timeMillis is null`)
        .run(transaction.transactionAmount, transaction.externalReceiptNumber, sessionUser.userName, Date.now(), transaction.licenceId, transaction.transactionIndex, transaction.batchDate);
    database.close();
    return result.changes > 0;
}

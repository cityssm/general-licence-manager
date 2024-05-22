import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function markBatchTransactionFailed(transaction, requestSession) {
    const database = sqlite(databasePath);
    const transactionAmountFixed = Number.parseFloat(transaction.transactionAmount).toFixed(2);
    const result = database
        .prepare(`update LicenceTransactions
        set transactionAmount = 0,
        transactionNote = ?,
        externalReceiptNumber = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?
        and transactionIndex = ?
        and batchDate = ?
        and recordDelete_timeMillis is null`)
        .run(`Failed amount = $${transactionAmountFixed}`, transaction.externalReceiptNumber, requestSession.user.userName, Date.now(), transaction.licenceId, transaction.transactionIndex, transaction.batchDate);
    database.close();
    return result.changes > 0;
}

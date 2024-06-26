import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
import { getConfigProperty } from '../helpers/functions.config.js';
import getNextLicenceTransactionIndex from './getNextLicenceTransactionIndex.js';
function isBankingInformationIncomplete(bankRecord) {
    return ((bankRecord.bankInstitutionNumber ?? '') === '' ||
        (bankRecord.bankTransitNumber ?? '') === '' ||
        (bankRecord.bankAccountNumber ?? '') === '');
}
export default function createOrUpdateBatchTransaction(transactionForm, sessionUser) {
    const database = sqlite(databasePath);
    let message;
    const bankRecord = database
        .prepare(`select bankInstitutionNumber, bankTransitNumber, bankAccountNumber
        from Licences
        where recordDelete_timeMillis is null
        and licenceId = ?
        and issueDate is not null`)
        .get(transactionForm.licenceId);
    if (bankRecord === undefined) {
        database.close();
        return {
            success: false,
            message: `${getConfigProperty('settings.licenceAlias')} is not available for updates (licenceId = ${transactionForm.licenceId}).`
        };
    }
    else if (isBankingInformationIncomplete(bankRecord)) {
        message = `Banking information is incomplete on the ${getConfigProperty('settings.licenceAlias').toLowerCase()}.`;
    }
    const batchDate = dateTimeFunctions.dateStringToInteger(transactionForm.batchDateString);
    const currentTransactionRecord = database
        .prepare(`select count(transactionIndex) as transactionCount,
        min(transactionIndex) as transactionIndexMin,
        max(externalReceiptNumber) as externalReceiptNumberMax
        from LicenceTransactions
        where recordCreate_timeMillis is not null
        and licenceId = ?
        and batchDate = ?`)
        .get(transactionForm.licenceId, batchDate);
    let runResult;
    const doDelete = transactionForm.transactionAmount === '' ||
        Number.parseFloat(transactionForm.transactionAmount.toString()) === 0;
    const rightNowMillis = Date.now();
    let transactionIndex;
    if (currentTransactionRecord &&
        currentTransactionRecord.transactionCount > 0) {
        transactionIndex = currentTransactionRecord.transactionIndexMin;
        if (currentTransactionRecord.externalReceiptNumberMax &&
            currentTransactionRecord.externalReceiptNumberMax !== '') {
            database.close();
            return {
                success: false,
                message: 'The transaction has already been processed and cannot be updated.',
                transactionIndex
            };
        }
        else if (doDelete) {
            runResult = database
                .prepare(`update LicenceTransactions
            set transactionAmount = 0,
            recordDelete_userName = ?,
            recordDelete_timeMillis = ?
            where licenceId = ?
            and transactionIndex = ?`)
                .run(sessionUser.userName, rightNowMillis, transactionForm.licenceId, transactionIndex);
        }
        else {
            if (currentTransactionRecord.transactionCount > 1) {
                database
                    .prepare(`update LicenceTransactions
              set transactionAmount = 0,
              recordDelete_userName = ?,
              recordDelete_timeMillis = ?
              where licenceId = ?
              and batchDate = ?
              and transactionIndex <> ?`)
                    .run(sessionUser.userName, rightNowMillis, transactionForm.licenceId, batchDate, transactionIndex);
            }
            runResult = database
                .prepare(`update LicenceTransactions
            set bankInstitutionNumber = ?,
            bankTransitNumber = ?,
            bankAccountNumber = ?,
            transactionAmount = ?,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?,
            recordDelete_userName = null,
            recordDelete_timeMillis = null
            where licenceId = ?
            and transactionIndex = ?`)
                .run(bankRecord.bankInstitutionNumber, bankRecord.bankTransitNumber, bankRecord.bankAccountNumber, transactionForm.transactionAmount, sessionUser.userName, rightNowMillis, transactionForm.licenceId, transactionIndex);
        }
    }
    else if (!doDelete) {
        transactionIndex = getNextLicenceTransactionIndex(transactionForm.licenceId, database);
        runResult = database
            .prepare(`insert into LicenceTransactions (
          licenceId, transactionIndex,
          transactionDate, transactionTime,
          bankInstitutionNumber, bankTransitNumber, bankAccountNumber,
          batchDate, transactionAmount,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(transactionForm.licenceId, transactionIndex, batchDate, 0, bankRecord.bankInstitutionNumber, bankRecord.bankTransitNumber, bankRecord.bankAccountNumber, batchDate, transactionForm.transactionAmount, sessionUser.userName, rightNowMillis, sessionUser.userName, rightNowMillis);
    }
    database.close();
    return {
        success: runResult ? runResult.changes > 0 : doDelete,
        message,
        transactionIndex
    };
}

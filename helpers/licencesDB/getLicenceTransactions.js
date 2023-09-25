import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
export const getLicenceTransactions = (licenceId, database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    database.function('userFn_dateIntegerToString', dateTimeFunctions.dateIntegerToString);
    database.function('userFn_timeIntegerToString', dateTimeFunctions.timeIntegerToString);
    const rows = database
        .prepare('select transactionIndex,' +
        ' transactionDate, userFn_dateIntegerToString(transactionDate) as transactionDateString,' +
        ' transactionTime, userFn_timeIntegerToString(transactionTime) as transactionTimeString,' +
        ' batchDate, userFn_dateIntegerToString(batchDate) as batchDateString,' +
        ' bankTransitNumber, bankInstitutionNumber, bankAccountNumber,' +
        ' externalReceiptNumber, transactionAmount, transactionNote' +
        ' from LicenceTransactions' +
        ' where recordDelete_timeMillis is null' +
        ' and licenceId = ?' +
        ' order by transactionDate, transactionTime, transactionIndex')
        .all(licenceId);
    if (doCloseDatabase) {
        database.close();
    }
    return rows;
};
export default getLicenceTransactions;

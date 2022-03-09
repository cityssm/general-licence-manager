import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getNextLicenceTransactionIndex } from "./getNextLicenceTransactionIndex.js";
export const addLicenceTransaction = (licenceTransactionForm, requestSession) => {
    const database = sqlite(databasePath);
    const transactionIndex = getNextLicenceTransactionIndex(licenceTransactionForm.licenceId, database);
    const rightNow = new Date();
    database
        .prepare("insert into LicenceTransactions" +
        "(licenceId, transactionIndex," +
        " transactionDate, transactionTime," +
        " bankTransitNumber, bankInstitutionNumber, bankAccountNumber," +
        " externalReceiptNumber, transactionAmount, transactionNote," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(licenceTransactionForm.licenceId, transactionIndex, licenceTransactionForm.transactionDateString && licenceTransactionForm.transactionDateString !== ""
        ? dateTimeFunctions.dateStringToInteger(licenceTransactionForm.transactionDateString)
        : dateTimeFunctions.dateToInteger(rightNow), licenceTransactionForm.transactionDateString && licenceTransactionForm.transactionDateString !== ""
        ? 0
        : dateTimeFunctions.dateToTimeInteger(rightNow), licenceTransactionForm.bankTransitNumber, licenceTransactionForm.bankInstitutionNumber, licenceTransactionForm.bankAccountNumber, licenceTransactionForm.externalReceiptNumber, licenceTransactionForm.transactionAmount, licenceTransactionForm.transactionNote, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    database.close();
    return transactionIndex;
};
export default addLicenceTransaction;

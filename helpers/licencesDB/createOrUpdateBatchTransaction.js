import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import * as configFunctions from "../functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getNextLicenceTransactionIndex } from "./getNextLicenceTransactionIndex.js";
export const createOrUpdateBatchTransaction = (transactionForm, requestSession) => {
    const database = sqlite(databasePath);
    let message;
    const bankRecord = database.prepare("select" +
        " bankInstitutionNumber, bankTransitNumber, bankAccountNumber" +
        " from Licences" +
        " where recordDelete_timeMillis is null" +
        " and licenceId = ?" +
        " and issueDate is not null")
        .get(transactionForm.licenceId);
    if (!bankRecord) {
        database.close();
        return {
            success: false,
            message: configFunctions.getProperty("settings.licenceAlias") + " is not available for updates (licenceId = " + transactionForm.licenceId + ")."
        };
    }
    else if (!bankRecord.bankInstitutionNumber || bankRecord.bankInstitutionNumber === "" ||
        !bankRecord.bankTransitNumber || bankRecord.bankTransitNumber === "" ||
        !bankRecord.bankAccountNumber || bankRecord.bankAccountNumber === "") {
        message = "Banking information is incomplete on the " + configFunctions.getProperty("settings.licenceAlias").toLowerCase() + ".";
    }
    const batchDate = dateTimeFunctions.dateStringToInteger(transactionForm.batchDateString);
    const currentTransactionRecord = database.prepare("select transactionIndex, externalReceiptNumber" +
        " from LicenceTransactions" +
        " where recordCreate_timeMillis is not null" +
        " and licenceId = ?" +
        " and batchDate = ?")
        .get(transactionForm.licenceId, batchDate);
    let runResult;
    const doDelete = transactionForm.transactionAmount === "" || Number.parseFloat(transactionForm.transactionAmount) === 0;
    const rightNowMillis = Date.now();
    let transactionIndex;
    if (currentTransactionRecord) {
        transactionIndex = currentTransactionRecord.transactionIndex;
        if (currentTransactionRecord.externalReceiptNumber && currentTransactionRecord.externalReceiptNumber !== "") {
            database.close();
            return {
                success: false,
                message: "The transaction has already been processed and cannot be updated.",
                transactionIndex
            };
        }
        else if (doDelete) {
            runResult = database.prepare("update LicenceTransactions" +
                " set transactionAmount = 0," +
                " recordDelete_userName = ?, " +
                " recordDelete_timeMillis = ?" +
                " where licenceId = ?" +
                " and transactionIndex = ?").run(requestSession.user.userName, rightNowMillis, transactionForm.licenceId, transactionIndex);
        }
        else {
            runResult = database.prepare("update LicenceTransactions" +
                " set bankInstitutionNumber = ?," +
                " bankTransitNumber = ?," +
                " bankAccountNumber = ?," +
                " transactionAmount = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?," +
                " recordDelete_userName = null," +
                " recordDelete_timeMillis = null" +
                " where licenceId = ?" +
                " and transactionIndex = ?")
                .run(bankRecord.bankInstitutionNumber, bankRecord.bankTransitNumber, bankRecord.bankAccountNumber, transactionForm.transactionAmount, requestSession.user.userName, rightNowMillis, transactionForm.licenceId, currentTransactionRecord.transactionIndex);
        }
    }
    else if (!doDelete) {
        transactionIndex = getNextLicenceTransactionIndex(transactionForm.licenceId, database);
        runResult = database.prepare("insert into LicenceTransactions" +
            " (licenceId, transactionIndex, transactionDate, transactionTime," +
            " bankInstitutionNumber, bankTransitNumber, bankAccountNumber," +
            " batchDate, transactionAmount," +
            " recordCreate_userName, recordCreate_timeMillis," +
            " recordUpdate_userName, recordUpdate_timeMillis)" +
            " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(transactionForm.licenceId, transactionIndex, batchDate, 0, bankRecord.bankInstitutionNumber, bankRecord.bankTransitNumber, bankRecord.bankAccountNumber, batchDate, transactionForm.transactionAmount, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    }
    database.close();
    return {
        success: (runResult ? runResult.changes > 0 : doDelete),
        message,
        transactionIndex
    };
};
export default createOrUpdateBatchTransaction;

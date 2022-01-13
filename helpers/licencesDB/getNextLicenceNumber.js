import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import * as configFunctions from "../functions.config.js";
const getNextYearNDigitsLicenceNumber = (database, digits) => {
    const currentYear = new Date().getFullYear();
    const regularExpression = new RegExp(currentYear.toString() + "-\\d+");
    const licenceNumberLength = 5 + digits;
    database.function("userFn_matchesFormat", (licenceNumber) => {
        return regularExpression.test(licenceNumber) ? 1 : 0;
    });
    const licenceNumber = database.prepare("select licenceNumber from Licences" +
        " where length(licenceNumber) = ?" +
        " and userFn_matchesFormat(licenceNumber) = 1" +
        " order by licenceNumber desc")
        .pluck()
        .get(licenceNumberLength);
    if (!licenceNumber) {
        return currentYear.toString() + "-" + "1".padStart(digits, "0");
    }
    const licenceNumberIndex = Number.parseInt(licenceNumber.split("-")[1]) + 1;
    return currentYear.toString() + "-" + "1".padStart(digits, licenceNumberIndex.toString());
};
export const getNextLicenceNumber = (database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    let licenceNumber = "";
    switch (configFunctions.getProperty("defaults.licenceNumberFunction")) {
        case "year-fourDigits":
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 4);
            break;
        case "year-fiveDigits":
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 5);
            break;
        case "year-sixDigits":
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 6);
            break;
    }
    if (doCloseDatabase) {
        database.close();
    }
    return licenceNumber;
};
export default getNextLicenceNumber;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import camelCase from "camelcase";
import * as cacheFunctions from "../functions.cache.js";
import * as configFunctions from "../functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
const licenceAliasSQL = camelCase(configFunctions.getProperty("settings.licenceAlias"));
const licenseeAliasSQL = camelCase(configFunctions.getProperty("settings.licenseeAlias"));
const licenceId = licenceAliasSQL + "Id";
const licenceNumber = licenceAliasSQL + "Number";
const licenceCategory = licenceAliasSQL + "Category";
const licenseeName = licenseeAliasSQL + "Name";
const licenseeBusinessName = licenseeAliasSQL + "BusinessName";
const licenseeAddress1 = licenseeAliasSQL + "Address1";
const licenseeAddress2 = licenseeAliasSQL + "Address2";
const licenseeCity = licenseeAliasSQL + "City";
const licenseeProvince = licenseeAliasSQL + "Province";
const licenseePostalCode = licenseeAliasSQL + "PostalCode";
const getLicencesByLicenceCategorySQL = (licenceCategoryKey) => {
    const licenceCategory = cacheFunctions.getLicenceCategory(licenceCategoryKey);
    const sqlParameters = [];
    let fieldsSql = "";
    for (const licenceField of licenceCategory.licenceCategoryFields) {
        fieldsSql += " max(case when f.licenceFieldKey = ? then f.licenceFieldValue else null end) as " + camelCase(licenceField.licenceField) + ",";
        sqlParameters.push(licenceField.licenceFieldKey);
    }
    const sql = "select l.licenceId as " + licenceId + "," +
        " c.licenceCategory as " + licenceCategory + "," +
        " l.licenceNumber as " + licenceNumber + "," +
        " l.licenseeName as " + licenseeName + "," +
        " l.licenseeBusinessName as " + licenseeBusinessName + "," +
        " l.licenseeAddress1 as " + licenseeAddress1 + "," +
        " l.licenseeAddress2 as " + licenseeAddress2 + "," +
        " l.licenseeCity as " + licenseeCity + "," +
        " l.licenseeProvince as " + licenseeProvince + "," +
        " l.licenseePostalCode as " + licenseePostalCode + "," +
        fieldsSql +
        " userFn_dateIntegerToString(l.startDate) as startDateString," +
        " userFn_dateIntegerToString(l.endDate) as endDateString," +
        " userFn_dateIntegerToString(l.issueDate) as issueDateString" +
        " from Licences l" +
        " left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey" +
        " left join LicenceFields f on l.licenceId = f.licenceId" +
        " where l.licenceCategoryKey = ?" +
        " group by l.licenceId, c.licenceCategory, l.licenceNumber," +
        " l.licenseeName, l.licenseeBusinessName, l.licenseeAddress1, l.licenseeAddress2," +
        " l.licenseeCity, l.licenseeProvince, l.licenseePostalCode," +
        " l.startDate, l.endDate" +
        " order by l.startDate desc, l.endDate desc, l.licenceId";
    sqlParameters.push(licenceCategoryKey);
    return {
        sql,
        sqlParameters
    };
};
export const getReportData = (reportName, reportParameters) => {
    let sql;
    let sqlParameters = [];
    switch (reportName) {
        case "licences-all":
            sql = "select * from Licences";
            break;
        case "licences-byLicenceCategory":
            const report = getLicencesByLicenceCategorySQL(reportParameters.licenceCategoryKey);
            sql = report.sql;
            sqlParameters = report.sqlParameters;
            break;
        case "licences-formatted":
            sql = "select l.licenceId as " + licenceId + "," +
                " c.licenceCategory as " + licenceCategory + "," +
                " l.licenceNumber as " + licenceNumber + "," +
                " l.licenseeName as " + licenseeName + "," +
                " l.licenseeBusinessName as " + licenseeBusinessName + "," +
                " l.licenseeAddress1 as " + licenseeAddress1 + "," +
                " l.licenseeAddress2 as " + licenseeAddress2 + "," +
                " l.licenseeCity as " + licenseeCity + "," +
                " l.licenseeProvince as " + licenseeProvince + "," +
                " l.licenseePostalCode as " + licenseePostalCode + "," +
                " userFn_dateIntegerToString(l.startDate) as startDateString," +
                " userFn_dateIntegerToString(l.endDate) as endDateString," +
                " userFn_dateIntegerToString(l.issueDate) as issueDateString" +
                " from Licences l" +
                " left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey" +
                " order by startDate desc, endDate desc, licenceId";
            break;
        case "licenceTransactions-all":
            sql = "select * from LicenceTransactions";
            break;
        case "licenceTransactions-byDate":
            sql = "select" +
                " c.licenceCategory as " + licenceCategory + "," +
                " l.licenceNumber as " + licenceNumber + "," +
                " l.licenseeName, l.licenseeBusinessName," +
                " userFn_dateIntegerToString(t.transactionDate) as transactionDateString," +
                " userFn_timeIntegerToString(t.transactionTime) as transactionTimeString," +
                " t.transactionAmount," +
                (configFunctions.getProperty("settings.includeBatches") ?
                    " userFn_dateIntegerToString(t.batchDate) as batchDateString," +
                        " userFn_getCanadianBankName(t.bankInstitutionNumber, t.bankTransitNumber) as bankName," +
                        " t.bankInstitutionNumber," +
                        " t.bankTransitNumber," +
                        " t.bankAccountNumber,"
                    : "") +
                " t.externalReceiptNumber," +
                " t.transactionNote" +
                " from LicenceTransactions t" +
                " left join Licences l on t.licenceId = l.licenceId" +
                " left join LicenceCategories c on l.licenceCategoryKey = c.licenceCategoryKey" +
                " where t.recordDelete_timeMillis is null" +
                " and t.transactionDate = ?" +
                " order by t.transactionTime";
            sqlParameters.push(dateTimeFunctions.dateStringToInteger(reportParameters.transactionDateString));
            break;
        default:
            return undefined;
    }
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    database.function("userFn_timeIntegerToString", dateTimeFunctions.timeIntegerToString);
    database.function("userFn_getCanadianBankName", getCanadianBankName);
    const rows = database.prepare(sql)
        .all(sqlParameters);
    database.close();
    return rows;
};
export default getReportData;

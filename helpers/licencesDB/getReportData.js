import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getReportData = (reportName, reportParameters) => {
    let sql;
    const sqlParameters = [];
    switch (reportName) {
        case "licences-all":
            sql = "select * from Licences";
            break;
        case "licences-formatted":
            sql = "select l.licenceId," +
                " c.licenceCategory, l.licenceNumber," +
                " l.licenseeName, l.licenseeBusinessName," +
                " l.licenseeAddress1, l.licenseeAddress2," +
                " l.licenseeCity, l.licenseeProvince, l.licenseePostalCode," +
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
                " c.licenceCategory, l.licenceNumber," +
                " userFn_dateIntegerToString(t.transactionDate) as transactionDateString," +
                " userFn_timeIntegerToString(t.transactionTime) as transactionTimeString," +
                " t.transactionAmount, t.externalReceiptNumber," +
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
            return [];
    }
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    database.function("userFn_timeIntegerToString", dateTimeFunctions.timeIntegerToString);
    const rows = database.prepare(sql)
        .all(sqlParameters);
    database.close();
    return rows;
};
export default getReportData;

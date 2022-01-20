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
        default:
            return [];
    }
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    const rows = database.prepare(sql)
        .all(sqlParameters);
    database.close();
    return rows;
};
export default getReportData;

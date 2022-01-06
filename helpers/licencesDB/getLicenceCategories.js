import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const getLicenceCategories = () => {
    const sql = "select licenceCategoryKey, licenceCategory, bylawNumber," +
        " licenceLengthYears, licenceLengthMonths, licenceLengthDays" +
        " from LicenceCategories" +
        " where recordDelete_timeMillis is null" +
        " order by licenceCategory, licenceCategoryKey";
    const database = sqlite(databasePath, {
        readonly: true
    });
    const rows = database.prepare(sql).all();
    database.close();
    return rows;
};
export default getLicenceCategories;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const getLicenceCategoryFields = (licenceCategoryKey, database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryFields = database.prepare("select licenceFieldKey, licenceField, licenceFieldDescription," +
        " isRequired, minimumLength, maximumLength, pattern" +
        " from LicenceCategoryFields" +
        " where recordDelete_timeMillis is null" +
        " and licenceCategoryKey = ?" +
        " order by orderNumber, licenceField")
        .all(licenceCategoryKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryFields;
};
export default getLicenceCategoryFields;

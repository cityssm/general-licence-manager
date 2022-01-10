import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const getLicenceCategoryField = (licenceFieldKey) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const licenceCategoryField = database.prepare("select licenceFieldKey, licenceCategoryKey," +
        " licenceField, licenceFieldDescription," +
        " isRequired, minimumLength, maximumLength, pattern" +
        " from LicenceCategoryFields" +
        " where recordDelete_timeMillis is null" +
        " and licenceFieldKey = ?")
        .get(licenceFieldKey);
    database.close();
    return licenceCategoryField;
};
export default getLicenceCategoryField;

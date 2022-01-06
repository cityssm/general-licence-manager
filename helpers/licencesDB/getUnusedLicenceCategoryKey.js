import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import slugify from "slugify";
const getUnusedKey = (database, unsluggedString, maxLength, searchSQL) => {
    let keyString = slugify(unsluggedString, {
        replacement: "-",
        lower: true,
        strict: true,
        locale: "en",
        trim: true
    });
    if (keyString.length > maxLength) {
        keyString = keyString.slice(0, maxLength);
    }
    return keyString;
};
export const getUnusedLicenceCategoryKey = (licenceCategory) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const sql = "select licenceCategoryKey" +
        " from LicenceCategories" +
        " where licenceCategoryKey = ?";
    const row = database.prepare(sql).get(licenceCategoryKey);
    if (!row) {
    }
    database.close();
    return licenceCategoryKey;
};
export default getLicenceCategories;

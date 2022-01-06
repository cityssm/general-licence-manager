import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
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
    let row = database.prepare(searchSQL).get(keyString);
    if (!row) {
        return keyString;
    }
    if (keyString.length + 3 > maxLength) {
        keyString = keyString.slice(0, maxLength - 4);
    }
    for (let index = 1; index <= 999; index += 1) {
        const possibleKeyString = keyString + "-" + index.toString();
        row = database.prepare(searchSQL).get(possibleKeyString);
        if (!row) {
            return possibleKeyString;
        }
    }
    while (true) {
        const possibleKeyString = uuidv4().slice(0, maxLength);
        row = database.prepare(searchSQL).get(possibleKeyString);
        if (!row) {
            return possibleKeyString;
        }
    }
};
export const getUnusedLicenceCategoryKey = (licenceCategory) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const licenceCategoryKey = getUnusedKey(database, licenceCategory, 20, "select licenceCategoryKey" +
        " from LicenceCategories" +
        " where licenceCategoryKey = ?");
    database.close();
    return licenceCategoryKey;
};

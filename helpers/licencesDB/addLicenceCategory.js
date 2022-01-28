import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import { getUnusedLicenceCategoryKey } from "./getUnusedKey.js";
export const addLicenceCategory = (licenceCategoryForm, requestSession) => {
    const licenceCategoryKey = (licenceCategoryForm.licenceCategoryKey && licenceCategoryForm.licenceCategoryKey !== ""
        ? licenceCategoryForm.licenceCategoryKey
        : getUnusedLicenceCategoryKey(licenceCategoryForm.licenceCategory));
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    database
        .prepare("insert into LicenceCategories" +
        "(licenceCategoryKey, licenceCategory," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
        .run(licenceCategoryKey, licenceCategoryForm.licenceCategory, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return licenceCategoryKey;
};
export default addLicenceCategory;

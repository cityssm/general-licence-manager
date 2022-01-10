import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const updateLicenceCategory = (licenceCategoryForm, requestSession) => {
    const database = sqlite(databasePath);
    database
        .prepare("update LicenceCategories" +
        " set licenceCategory = ?," +
        " bylawNumber = ?," +
        " printEJS = ?," +
        " licenceLengthYears = ?," +
        " licenceLengthMonths = ?," +
        " licenceLengthDays = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceCategoryKey = ?")
        .run(licenceCategoryForm.licenceCategory, licenceCategoryForm.bylawNumber, licenceCategoryForm.printEJS, licenceCategoryForm.licenceLengthYears, licenceCategoryForm.licenceLengthMonths, licenceCategoryForm.licenceLengthDays, requestSession.user.userName, Date.now(), licenceCategoryForm.licenceCategoryKey);
    database.close();
    return true;
};
export default updateLicenceCategory;

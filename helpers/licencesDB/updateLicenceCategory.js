import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function updateLicenceCategory(licenceCategoryForm, sessionUser) {
    const database = sqlite(databasePath);
    database
        .prepare(`update LicenceCategories
        set licenceCategory = ?,
        bylawNumber = ?,
        printEJS = ?,
        licenceLengthFunction = ?,
        licenceLengthYears = ?,
        licenceLengthMonths = ?,
        licenceLengthDays = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceCategoryKey = ?`)
        .run(licenceCategoryForm.licenceCategory, licenceCategoryForm.bylawNumber, licenceCategoryForm.printEJS, licenceCategoryForm.licenceLengthFunction, licenceCategoryForm.licenceLengthYears, licenceCategoryForm.licenceLengthMonths, licenceCategoryForm.licenceLengthDays, sessionUser.userName, Date.now(), licenceCategoryForm.licenceCategoryKey);
    database.close();
    return true;
}

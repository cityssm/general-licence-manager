import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
import { getUnusedLicenceCategoryKey } from './getUnusedKey.js';
export default function addLicenceCategory(licenceCategoryForm, sessionUser) {
    const licenceCategoryKey = (licenceCategoryForm.licenceCategoryKey ?? '') === ''
        ? getUnusedLicenceCategoryKey(licenceCategoryForm.licenceCategory)
        : licenceCategoryForm.licenceCategoryKey;
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    database
        .prepare(`insert into LicenceCategories (
        licenceCategoryKey, licenceCategory,
        recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?)`)
        .run(licenceCategoryKey, licenceCategoryForm.licenceCategory, sessionUser.userName, rightNowMillis, sessionUser.userName, rightNowMillis);
    database.close();
    return licenceCategoryKey;
}

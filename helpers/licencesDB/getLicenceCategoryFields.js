import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function getLicenceCategoryFields(licenceCategoryKey, database) {
    let doCloseDatabase = false;
    if (database === undefined) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryFields = database
        .prepare(`select licenceFieldKey, licenceCategoryKey,
        licenceField, licenceFieldDescription,
        isRequired,
        minimumLength, maximumLength, pattern,
        printKey,
        orderNumber
        from LicenceCategoryFields
        where recordDelete_timeMillis is null
        and licenceCategoryKey = ?
        order by orderNumber, licenceField`)
        .all(licenceCategoryKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryFields;
}

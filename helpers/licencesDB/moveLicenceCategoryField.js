import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import getLicenceCategoryField from './getLicenceCategoryField.js';
import getLicenceCategoryFields from './getLicenceCategoryFields.js';
const sql = `update LicenceCategoryFields
    set orderNumber = ?,
    recordUpdate_userName = ?,
    recordUpdate_timeMillis = ?
    where licenceFieldKey = ?`;
export default function moveLicenceCategoryField(licenceFieldKeyFrom, licenceFieldKeyTo, requestSession) {
    const database = sqlite(databasePath);
    const licenceCategoryFieldFrom = getLicenceCategoryField(licenceFieldKeyFrom, database);
    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryFieldFrom.licenceCategoryKey, database);
    let expectedOrderNumber = 0;
    for (const licenceCategoryField of licenceCategoryFields) {
        if (licenceCategoryField.licenceFieldKey === licenceFieldKeyFrom) {
            continue;
        }
        expectedOrderNumber += 1;
        if (licenceCategoryField.licenceFieldKey === licenceFieldKeyTo) {
            database
                .prepare(sql)
                .run(expectedOrderNumber, requestSession.user.userName, Date.now(), licenceFieldKeyFrom);
            expectedOrderNumber += 1;
        }
        if (licenceCategoryField.orderNumber !== expectedOrderNumber) {
            database
                .prepare(sql)
                .run(expectedOrderNumber, requestSession.user.userName, Date.now(), licenceCategoryField.licenceFieldKey);
        }
    }
    database.close();
    return licenceCategoryFieldFrom.licenceCategoryKey;
}

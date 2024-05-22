import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export function deleteRelatedLicence(licenceIdA, licenceIdB) {
    const database = sqlite(databasePath);
    const result = database
        .prepare(`delete from RelatedLicences
        where (licenceIdA = ? and licenceIdB = ?)
        or (licenceIdA = ? and licenceIdB = ?)`)
        .run(licenceIdA, licenceIdB, licenceIdB, licenceIdA);
    database.close();
    return result.changes > 0;
}
export default deleteRelatedLicence;

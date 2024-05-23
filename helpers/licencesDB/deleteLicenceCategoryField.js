import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function deleteLicenceCategoryField(licenceFieldKey, sessionUser) {
    const database = sqlite(databasePath);
    const row = database
        .prepare('select licenceId from LicenceFields where licenceFieldKey = ?')
        .get(licenceFieldKey);
    if (row === undefined) {
        database
            .prepare('delete from LicenceCategoryFields where licenceFieldKey = ?')
            .run(licenceFieldKey);
    }
    else {
        database
            .prepare(`update LicenceCategoryFields
          set recordDelete_userName = ?,
          recordDelete_timeMillis = ?
          where licenceFieldKey = ?`)
            .run(sessionUser.userName, Date.now(), licenceFieldKey);
    }
    database.close();
    return true;
}

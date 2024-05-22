import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function getLicenceCategoryAdditionalFees(licenceCategoryKey, database) {
    let doCloseDatabase = false;
    if (database === undefined) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryAdditionalFees = database
        .prepare(`select licenceCategoryKey, licenceAdditionalFeeKey,
        additionalFee, additionalFeeType, additionalFeeNumber, additionalFeeFunction,
        isRequired, orderNumber
        from LicenceCategoryAdditionalFees
        where recordDelete_timeMillis is null
        and licenceCategoryKey = ?
        order by orderNumber, additionalFee`)
        .all(licenceCategoryKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryAdditionalFees;
}

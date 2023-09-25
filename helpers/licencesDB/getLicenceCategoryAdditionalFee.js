import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export const getLicenceCategoryAdditionalFee = (licenceAdditionalFeeKey, database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryAdditionalFee = database
        .prepare('select licenceCategoryKey, licenceAdditionalFeeKey,' +
        ' additionalFee, additionalFeeType, additionalFeeNumber, additionalFeeFunction,' +
        ' isRequired, orderNumber' +
        ' from LicenceCategoryAdditionalFees' +
        ' where recordDelete_timeMillis is null' +
        ' and licenceAdditionalFeeKey = ?')
        .get(licenceAdditionalFeeKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryAdditionalFee;
};
export default getLicenceCategoryAdditionalFee;

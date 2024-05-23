import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function updateLicenceCategoryAdditionalFee(licenceCategoryAdditionalFeeForm, sessionUser) {
    const database = sqlite(databasePath);
    database
        .prepare(`update LicenceCategoryAdditionalFees
        set additionalFee = ?,
        additionalFeeType = ?,
        additionalFeeNumber = ?,
        additionalFeeFunction = ?,
        isRequired = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceAdditionalFeeKey = ?`)
        .run(licenceCategoryAdditionalFeeForm.additionalFee, licenceCategoryAdditionalFeeForm.additionalFeeType, licenceCategoryAdditionalFeeForm.additionalFeeNumber, licenceCategoryAdditionalFeeForm.additionalFeeFunction ?? '', licenceCategoryAdditionalFeeForm.isRequired ? 1 : 0, sessionUser.userName, Date.now(), licenceCategoryAdditionalFeeForm.licenceAdditionalFeeKey);
    database.close();
    return true;
}

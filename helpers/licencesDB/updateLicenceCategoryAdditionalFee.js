import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const updateLicenceCategoryAdditionalFee = (licenceCategoryAdditionalFeeForm, requestSession) => {
    const database = sqlite(databasePath);
    database
        .prepare("update LicenceCategoryAdditionalFees" +
        " set additionalFee = ?," +
        " additionalFeeType = ?," +
        " additionalFeeNumber = ?," +
        " additionalFeeFunction = ?," +
        " isRequired = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceAdditionalFeeKey = ?")
        .run(licenceCategoryAdditionalFeeForm.additionalFee, licenceCategoryAdditionalFeeForm.additionalFeeType, licenceCategoryAdditionalFeeForm.additionalFeeNumber, licenceCategoryAdditionalFeeForm.additionalFeeFunction || "", licenceCategoryAdditionalFeeForm.isRequired ? 1 : 0, requestSession.user.userName, Date.now(), licenceCategoryAdditionalFeeForm.licenceAdditionalFeeKey);
    database.close();
    return true;
};
export default updateLicenceCategoryAdditionalFee;

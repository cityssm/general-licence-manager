import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const getLicenceCategoryAdditionalFees = (licenceCategoryKey, database) => {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    const licenceCategoryAdditionalFees = database.prepare("select licenceAdditionalFeeKey," +
        " additionalFee, additionalFeeType, additionalFeeNumber, additionalFeeFunction," +
        " isRequired, orderNumber" +
        " from LicenceCategoryAdditionalFees" +
        " where recordDelete_timeMillis is null" +
        " and licenceCategoryKey = ?" +
        " order by orderNumber, additionalFee")
        .all(licenceCategoryKey);
    if (doCloseDatabase) {
        database.close();
    }
    return licenceCategoryAdditionalFees;
};
export default getLicenceCategoryAdditionalFees;

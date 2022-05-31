import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const deleteLicenceCategoryAdditionalFee = (licenceAdditionalFeeKey, requestSession) => {
    const database = sqlite(databasePath);
    const row = database
        .prepare("select licenceId from LicenceAdditionalFees" +
        " where licenceAdditionalFeeKey = ?")
        .get(licenceAdditionalFeeKey);
    if (row) {
        database.prepare("update LicenceCategoryAdditionalFees" +
            " set recordDelete_userName = ?," +
            " recordDelete_timeMillis = ?" +
            " where licenceAdditionalFeeKey = ?")
            .run(requestSession.user.userName, Date.now(), licenceAdditionalFeeKey);
    }
    else {
        database.prepare("delete from LicenceCategoryAdditionalFees" +
            " where licenceAdditionalFeeKey = ?")
            .run(licenceAdditionalFeeKey);
    }
    database.close();
    return true;
};
export default deleteLicenceCategoryAdditionalFee;

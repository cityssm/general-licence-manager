import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import { getLicenceCategoryAdditionalFee } from "./getLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "./getLicenceCategoryAdditionalFees.js";
const sql = "update LicenceCategoryAdditionalFees" +
    " set orderNumber = ?," +
    " recordUpdate_userName = ?," +
    " recordUpdate_timeMillis = ?" +
    " where licenceAdditionalFeeKey = ?";
export const moveLicenceCategoryAdditionalFee = (licenceAdditionalFeeKey_from, licenceAdditionalFeeKey_to, requestSession) => {
    const database = sqlite(databasePath);
    const licenceCategoryAdditionalFee_from = getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey_from, database);
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee_from.licenceCategoryKey, database);
    let expectedOrderNumber = 0;
    for (const licenceCategoryAdditionalFee of licenceCategoryAdditionalFees) {
        if (licenceCategoryAdditionalFee.licenceAdditionalFeeKey === licenceAdditionalFeeKey_from) {
            continue;
        }
        expectedOrderNumber += 1;
        if (licenceCategoryAdditionalFee.licenceAdditionalFeeKey === licenceAdditionalFeeKey_to) {
            database.prepare(sql)
                .run(expectedOrderNumber, requestSession.user.userName, Date.now(), licenceAdditionalFeeKey_from);
            expectedOrderNumber += 1;
        }
        if (licenceCategoryAdditionalFee.orderNumber !== expectedOrderNumber) {
            database.prepare(sql)
                .run(expectedOrderNumber, requestSession.user.userName, Date.now(), licenceCategoryAdditionalFee.licenceAdditionalFeeKey);
        }
    }
    database.close();
    return licenceCategoryAdditionalFee_from.licenceCategoryKey;
};
export default moveLicenceCategoryAdditionalFee;

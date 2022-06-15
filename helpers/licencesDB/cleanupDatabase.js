import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
const recordDelete_timeMillis_is_not_null = "recordDelete_timeMillis is not null";
const cleanupQueries = [
    ("delete from LicenceTransactions" +
        " where " + recordDelete_timeMillis_is_not_null),
    ("delete from RelatedLicences" +
        " where licenceIdA in (select licenceId from Licences where " + recordDelete_timeMillis_is_not_null + ")" +
        " or licenceIdB in (select licenceId from Licences where " + recordDelete_timeMillis_is_not_null + ")"),
    ("delete from LicenceFields" +
        " where licenceId in (select licenceId from Licences where " + recordDelete_timeMillis_is_not_null + ")"),
    ("delete from LicenceApprovals" +
        " where licenceId in (select licenceId from Licences where " + recordDelete_timeMillis_is_not_null + ")"),
    ("delete from LicenceAdditionalFees" +
        " where licenceId in (select licenceId from Licences where " + recordDelete_timeMillis_is_not_null + ")"),
    ("delete from Licences" +
        " where " + recordDelete_timeMillis_is_not_null +
        " and licenceId not in (select licenceId from LicenceAdditionalFees)" +
        " and licenceId not in (select licenceId from LicenceFields)" +
        " and licenceId not in (select licenceId from LicenceApprovals)" +
        " and licenceId not in (select licenceId from LicenceTransactions)" +
        " and licenceId not in (select licenceIdA from RelatedLicences)" +
        " and licenceId not in (select licenceIdB from RelatedLicences)"),
    ("delete from LicenceCategoryFields" +
        " where (" + recordDelete_timeMillis_is_not_null + " or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where " + recordDelete_timeMillis_is_not_null + "))" +
        " and licenceFieldKey not in (select licenceFieldKey from LicenceFields)"),
    ("delete from LicenceCategoryApprovals" +
        " where (" + recordDelete_timeMillis_is_not_null + " or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where " + recordDelete_timeMillis_is_not_null + "))" +
        " and licenceApprovalKey not in (select licenceApprovalKey from LicenceApprovals)"),
    ("delete from LicenceCategoryAdditionalFees" +
        " where (" + recordDelete_timeMillis_is_not_null + " or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where " + recordDelete_timeMillis_is_not_null + "))" +
        " and licenceAdditionalFeeKey not in (select licenceAdditionalFeeKey from LicenceAdditionalFees)"),
    ("delete from LicenceCategoryFees" +
        " where (" + recordDelete_timeMillis_is_not_null + " or licenceCategoryKey in (select licenceCategoryKey from LicenceCategories where " + recordDelete_timeMillis_is_not_null + "))" +
        " and licenceCategoryKey not in (select licenceCategoryKey from Licences)"),
    ("delete from LicenceCategories" +
        " where " + recordDelete_timeMillis_is_not_null +
        " and licenceCategoryKey not in (select licenceCategoryKey from Licences)" +
        " and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryFields)" +
        " and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryApprovals)" +
        " and licenceCategoryKey not in (select licenceCategoryKey from LicenceAdditionalFees)" +
        " and licenceCategoryKey not in (select licenceCategoryKey from LicenceCategoryFees)")
];
export const cleanupDatabase = () => {
    const database = sqlite(databasePath);
    let rowCount = 0;
    for (const cleanupQuery of cleanupQueries) {
        rowCount += database.prepare(cleanupQuery).run().changes;
    }
    database.close();
    return rowCount;
};
export default cleanupDatabase;

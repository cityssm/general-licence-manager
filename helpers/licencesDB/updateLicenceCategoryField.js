import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const updateLicenceCategoryField = (licenceCategoryFieldForm, requestSession) => {
    const database = sqlite(databasePath);
    database
        .prepare("update LicenceCategoryFields" +
        " set licenceField = ?," +
        " licenceFieldDescription = ?," +
        " isRequired = ?," +
        " minimumLength = ?," +
        " maximumLength = ?," +
        " pattern = ?," +
        " printKey = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceFieldKey = ?")
        .run(licenceCategoryFieldForm.licenceField, licenceCategoryFieldForm.licenceFieldDescription, licenceCategoryFieldForm.isRequired ? 1 : 0, licenceCategoryFieldForm.minimumLength, licenceCategoryFieldForm.maximumLength, licenceCategoryFieldForm.pattern, licenceCategoryFieldForm.printKey, requestSession.user.userName, Date.now(), licenceCategoryFieldForm.licenceFieldKey);
    database.close();
    return true;
};
export default updateLicenceCategoryField;

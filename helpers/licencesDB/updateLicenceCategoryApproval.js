import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const updateLicenceCategoryApproval = (licenceCategoryApprovalForm, requestSession) => {
    const database = sqlite(databasePath);
    database
        .prepare("update LicenceCategoryApprovals" +
        " set licenceApproval = ?," +
        " licenceApprovalDescription = ?," +
        " isRequiredForNew = ?," +
        " isRequiredForRenewal = ?," +
        " printKey = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceApprovalKey = ?")
        .run(licenceCategoryApprovalForm.licenceApproval, licenceCategoryApprovalForm.licenceApprovalDescription, licenceCategoryApprovalForm.isRequiredForNew ? 1 : 0, licenceCategoryApprovalForm.isRequiredForRenewal ? 1 : 0, licenceCategoryApprovalForm.printKey, requestSession.user.userName, Date.now(), licenceCategoryApprovalForm.licenceApprovalKey);
    database.close();
    return true;
};
export default updateLicenceCategoryApproval;

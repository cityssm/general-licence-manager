import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
import { getLicenceCategoryFields } from "./getLicenceCategoryFields.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getLicenceCategory = (licenceCategoryKey, options) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const licenceCategory = database.prepare("select licenceCategoryKey, licenceCategory, bylawNumber, printEJS," +
        " licenceLengthYears, licenceLengthMonths, licenceLengthDays" +
        " from LicenceCategories" +
        " where recordDelete_timeMillis is null" +
        " and licenceCategoryKey = ?")
        .get(licenceCategoryKey);
    if (licenceCategory && options.includeApprovals) {
        licenceCategory.licenceCategoryApprovals =
            database.prepare("select licenceApprovalKey, licenceApproval, licenceApprovalDescription," +
                " isRequiredForNew, isRequiredForRenewal" +
                " from LicenceCategoryApprovals" +
                " where recordDelete_timeMillis is null" +
                " and licenceCategoryKey = ?" +
                " order by orderNumber, licenceApproval")
                .all(licenceCategoryKey);
    }
    if (licenceCategory && options.includeFees) {
        const parameters = [licenceCategoryKey];
        if (options.includeFees === "current") {
            const currentDate = dateTimeFunctions.dateToInteger(new Date());
            parameters.push(currentDate, currentDate);
        }
        licenceCategory.licenceCategoryFees =
            database.prepare("select effectiveStartDate, effectiveEndDate," +
                " licenceFee, renewalFee, replacementFee" +
                " from LicenceCategoryFees" +
                " where recordDelete_timeMillis is null" +
                " and licenceCategoryKey = ?" +
                (options.includeFees === "current"
                    ? " and effectiveStartDate <= ?" +
                        " (and effectiveEndDate is null or effectiveEndDate >= ?)"
                    : "") +
                " order by effectiveStartDate desc")
                .all(parameters);
    }
    if (licenceCategory && options.includeFields) {
        licenceCategory.licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey);
    }
    database.close();
    return licenceCategory;
};
export default getLicenceCategory;

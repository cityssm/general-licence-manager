import fs from "fs/promises";
import path from "path";
import * as cacheFunctions from "./functions.cache.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
let printEJSList = [];
export const getPrintEJSList = async () => {
    if (printEJSList.length === 0) {
        const printPath = path.join("print");
        const allFiles = await fs.readdir(printPath);
        const ejsList = [];
        for (const fileName of allFiles) {
            const filePath = path.join(printPath, fileName);
            const fileStats = await fs.stat(filePath);
            if (fileStats.isFile() && fileName.toLowerCase().endsWith(".ejs")) {
                ejsList.push(fileName.slice(0, -4));
            }
        }
        printEJSList = ejsList;
    }
    return printEJSList;
};
export const getLicenceFieldByPrintKey = (licence, printKey) => {
    return licence.licenceFields.find((currentLicenceField) => {
        return currentLicenceField.printKey === printKey;
    });
};
export const getLicenceFieldsByPrintKeyPiece = (licence, printKeyPiece) => {
    return licence.licenceFields.filter((currentLicenceField) => {
        return currentLicenceField.printKey.includes(printKeyPiece);
    });
};
export const getLicenceApprovalByPrintKey = (licence, printKey) => {
    return licence.licenceApprovals.find((currentLicenceApproval) => {
        return currentLicenceApproval.printKey === printKey;
    });
};
export const getLicenceLengthEndDateString = (licence) => {
    const licenceCategory = cacheFunctions.getLicenceCategory(licence.licenceCategoryKey);
    if (licenceCategory.licenceLengthFunction && licenceCategory.licenceLengthFunction !== "") {
        return licence.endDateString;
    }
    let licenceLengthEndDateString = "";
    const calculatedEndDate = dateTimeFunctions.dateIntegerToDate(licence.startDate);
    if (licenceCategory.licenceLengthYears > 0) {
        calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + licenceCategory.licenceLengthYears);
        calculatedEndDate.setDate(calculatedEndDate.getDate() - 1);
        licenceLengthEndDateString = licenceCategory.licenceLengthYears +
            " year" +
            (licenceCategory.licenceLengthYears === 1 ? "" : "s");
    }
    if (licenceCategory.licenceLengthMonths > 0) {
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + licenceCategory.licenceLengthMonths);
        calculatedEndDate.setDate(calculatedEndDate.getDate() - 1);
        licenceLengthEndDateString += (licenceLengthEndDateString === "" ? "" : ", ") +
            licenceCategory.licenceLengthMonths +
            " month" +
            (licenceCategory.licenceLengthMonths === 1 ? "" : "s");
    }
    if (licenceCategory.licenceLengthDays > 0) {
        calculatedEndDate.setDate(calculatedEndDate.getDate() + licenceCategory.licenceLengthDays - 1);
        licenceLengthEndDateString += (licenceLengthEndDateString === "" ? "" : ", ") +
            licenceCategory.licenceLengthDays +
            " day" +
            (licenceCategory.licenceLengthDays === 1 ? "" : "s");
    }
    if (licenceLengthEndDateString === "" || licence.endDate !== dateTimeFunctions.dateToInteger(calculatedEndDate)) {
        return licence.endDateString;
    }
    return licenceLengthEndDateString;
};

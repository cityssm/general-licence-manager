import fs from "fs";
import { sqlConfig } from "./sqlConfig.js";
import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as cacheFunctions from "../helpers/functions.cache.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../data/databasePaths.js";
import { initLicencesDB } from "../helpers/databaseInitializer.js";
import { addLicenceCategory } from "../helpers/licencesDB/addLicenceCategory.js";
import { updateLicenceCategory } from "../helpers/licencesDB/updateLicenceCategory.js";
import { addLicenceCategoryField } from "../helpers/licencesDB/addLicenceCategoryField.js";
import { addLicenceCategoryApproval } from "../helpers/licencesDB/addLicenceCategoryApproval.js";
import { updateLicenceCategoryApproval } from "../helpers/licencesDB/updateLicenceCategoryApproval.js";
import { addLicenceCategoryFee } from "../helpers/licencesDB/addLicenceCategoryFee.js";
import { updateLicenceCategoryFee } from "../helpers/licencesDB/updateLicenceCategoryFee.js";
import { createLicence } from "../helpers/licencesDB/createLicence.js";
import { saveLicenceFields } from "../helpers/licencesDB/saveLicenceFields.js";
import { saveLicenceApprovals } from "../helpers/licencesDB/saveLicenceApprovals.js";
import { addLicenceTransaction } from "../helpers/licencesDB/addLicenceTransaction.js";
import { issueLicenceWithDate } from "../helpers/licencesDB/issueLicence.js";
import Debug from "debug";
const debug = Debug("general-licence-manager:importFromLegacy");
const licenceCategoryKeys_march30NextYear = new Set(["01", "02", "04", "09", "37"]);
const licenceField_VEHYR = "Vehicle Year";
const licenceField_VEHMAKE = "Vehicle Make";
const licenceField_VEHSER = "Vehicle VIN";
const licenceField_SPCPROV1 = "Special Provisions 1";
const licenceField_SPCPROV2 = "Special Provisions 2";
const currentYearString = new Date().getFullYear().toString();
const nextYearString = (new Date().getFullYear() + 1).toString();
const session = {
    user: {
        userName: "import",
        userProperties: {
            canUpdate: true,
            isAdmin: true
        }
    }
};
const recreateDatabase = () => {
    debug("Deleting " + databasePath);
    try {
        fs.unlinkSync(databasePath);
    }
    catch (error) {
        console.error(error);
        return false;
    }
    debug("Deleted successfully.");
    debug("Creating " + databasePath);
    initLicencesDB();
    debug("Created successfully.");
    return true;
};
const importLicenceCategories = async () => {
    cacheFunctions.clearAll();
    debug("Importing categories.");
    const sourcePool = await sqlPool.connect(sqlConfig);
    const result = await sourcePool.request()
        .query("select * from Replicator.LCTABL");
    const rows = result.recordset;
    for (const categoryRow of rows) {
        debug("- Importing " + categoryRow.LGTA_CATEGORY_NAME.trim());
        const licenceCategoryKey = addLicenceCategory({
            licenceCategoryKey: categoryRow.LGTA_CATEGORY.trim(),
            licenceCategory: categoryRow.LGTA_CATEGORY_NAME.trim()
        }, session);
        updateLicenceCategory({
            licenceCategoryKey,
            licenceCategory: categoryRow.LGTA_CATEGORY_NAME.trim(),
            bylawNumber: categoryRow.LGTA_BYLAW_NO.trim(),
            licenceLengthFunction: licenceCategoryKeys_march30NextYear.has(licenceCategoryKey)
                ? "march30NextYear"
                : "",
            licenceLengthYears: "1",
            licenceLengthMonths: "0",
            licenceLengthDays: "0",
            printEJS: "ssm-municipalLicence"
        }, session);
        addLicenceCategoryField({
            licenceCategoryKey,
            licenceField: licenceField_VEHYR
        }, session);
        addLicenceCategoryField({
            licenceCategoryKey,
            licenceField: licenceField_VEHMAKE
        }, session);
        addLicenceCategoryField({
            licenceCategoryKey,
            licenceField: licenceField_VEHSER
        }, session);
        addLicenceCategoryField({
            licenceCategoryKey,
            licenceField: licenceField_SPCPROV1
        }, session);
        addLicenceCategoryField({
            licenceCategoryKey,
            licenceField: licenceField_SPCPROV2
        }, session);
        const newApprovalKey = addLicenceCategoryApproval({
            licenceCategoryKey,
            licenceApproval: categoryRow.LGTA_NEW_APPROVALS.trim()
        }, session);
        updateLicenceCategoryApproval({
            licenceApprovalKey: newApprovalKey,
            licenceApproval: categoryRow.LGTA_NEW_APPROVALS.trim(),
            licenceApprovalDescription: "Required for New Licences",
            isRequiredForNew: "true",
            printKey: "approval-new"
        }, session);
        if (categoryRow.LGTA_RENEWAL_APPROVALS) {
            const renewalApprovalKey = addLicenceCategoryApproval({
                licenceCategoryKey,
                licenceApproval: categoryRow.LGTA_RENEWAL_APPROVALS.trim()
            }, session);
            updateLicenceCategoryApproval({
                licenceApprovalKey: renewalApprovalKey,
                licenceApproval: categoryRow.LGTA_RENEWAL_APPROVALS.trim(),
                licenceApprovalDescription: "Required for Renewed Licences",
                isRequiredForRenewal: "true",
                printKey: "approval-renew"
            }, session);
        }
        const licenceFeeId = addLicenceCategoryFee(licenceCategoryKey, session);
        updateLicenceCategoryFee({
            licenceFeeId,
            effectiveStartDateString: currentYearString + "0101",
            effectiveEndDateString: "",
            licenceFee: categoryRow.LGTA_LICENCE_FEE,
            renewalFee: categoryRow.LGTA_RENEWAL_FEE,
            replacementFee: categoryRow.LGTA_REPLACE_FEE
        }, session);
    }
    cacheFunctions.clearAll();
    debug("Categories imported successfully.");
};
const importLicences = async () => {
    debug("Importing licences.");
    const sourcePool = await sqlPool.connect(sqlConfig);
    const result = await sourcePool.request()
        .query("select * from Replicator.LCMAST");
    const rows = result.recordset;
    for (const licenceRow of rows) {
        const licenceNumber = currentYearString + "-" + licenceRow.LGMA_SEQ;
        debug("- Importing " + licenceNumber);
        const licenseeCity = licenceRow.LGMA_CITY.split(",");
        const licenceCategory = cacheFunctions.getLicenceCategory(licenceRow.LGMA_CAT);
        const isRenewal = !(licenceRow.LGMA_AMOUNT === licenceCategory.licenceCategoryFees[0].licenceFee);
        const issueDate = new Date(licenceRow.LGMA_ISS_YR, licenceRow.LGMA_ISS_MN - 1, licenceRow.LGMA_ISS_DY);
        const startDateString = licenceRow.LGMA_ISS_YR > 0
            ? dateTimeFunctions.dateToString(issueDate)
            : currentYearString + "-01-01";
        let endDateString = nextYearString + "-03-30";
        if (licenceCategory.licenceLengthFunction === "") {
            const endDate = dateTimeFunctions.dateStringToDate(startDateString);
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setDate(endDate.getDate() - 1);
            endDateString = dateTimeFunctions.dateToString(endDate);
        }
        const licenceId = createLicence({
            licenceCategoryKey: licenceRow.LGMA_CAT,
            licenceNumber,
            licenseeName: licenceRow.LGMA_NAME.trim(),
            licenseeBusinessName: licenceRow.LGMA_BUS_NAME ? licenceRow.LGMA_BUS_NAME.trim() : "",
            licenseeAddress1: licenceRow.LGMA_ADDRESS.trim(),
            licenseeAddress2: "",
            licenseeCity: licenseeCity[0].trim(),
            licenseeProvince: licenseeCity.length > 1
                ? licenseeCity[1].trim().slice(0, 2)
                : "ON",
            licenseePostalCode: licenceRow.LGMA_PCODE1 + licenceRow.LGMA_PCODE2.trim(),
            bankInstitutionNumber: "",
            bankTransitNumber: "",
            bankAccountNumber: "",
            isRenewal: isRenewal ? "true" : undefined,
            startDateString,
            endDateString,
            licenceFee: isRenewal
                ? licenceCategory.licenceCategoryFees[0].renewalFee.toFixed(2)
                : licenceCategory.licenceCategoryFees[0].licenceFee.toFixed(2),
            replacementFee: licenceCategory.licenceCategoryFees[0].replacementFee.toFixed(2)
        }, session);
        const licenceFieldKeysToSave = [];
        let licenceFormToSave = {};
        for (const licenceCategoryField of licenceCategory.licenceCategoryFields) {
            if (licenceCategoryField.licenceField === licenceField_VEHYR && licenceRow.LGMA_VEHYR > 0) {
                licenceFieldKeysToSave.push(licenceCategoryField.licenceFieldKey);
                licenceFormToSave["field--" + licenceCategoryField.licenceFieldKey] = licenceRow.LGMA_VEHYR.toString();
            }
            else if (licenceCategoryField.licenceField === licenceField_VEHMAKE && licenceRow.LGMA_VEHMAKE) {
                licenceFieldKeysToSave.push(licenceCategoryField.licenceFieldKey);
                licenceFormToSave["field--" + licenceCategoryField.licenceFieldKey] = licenceRow.LGMA_VEHMAKE;
            }
            else if (licenceCategoryField.licenceField === licenceField_VEHSER && licenceRow.LGMA_VEHSER) {
                licenceFieldKeysToSave.push(licenceCategoryField.licenceFieldKey);
                licenceFormToSave["field--" + licenceCategoryField.licenceFieldKey] = licenceRow.LGMA_VEHSER;
            }
            else if (licenceCategoryField.licenceField === licenceField_SPCPROV1 && licenceRow.LGMA_SPCPROV1) {
                licenceFieldKeysToSave.push(licenceCategoryField.licenceFieldKey);
                licenceFormToSave["field--" + licenceCategoryField.licenceFieldKey] = licenceRow.LGMA_SPCPROV1;
            }
            else if (licenceCategoryField.licenceField === licenceField_SPCPROV2 && licenceRow.LGMA_SPCPROV2) {
                licenceFieldKeysToSave.push(licenceCategoryField.licenceFieldKey);
                licenceFormToSave["field--" + licenceCategoryField.licenceFieldKey] = licenceRow.LGMA_SPCPROV2;
            }
        }
        if (licenceFieldKeysToSave.length > 0) {
            saveLicenceFields(licenceId, licenceFieldKeysToSave, licenceFormToSave);
        }
        if (licenceRow.LGMA_ISS_YR > 0) {
            const licenceApprovalKeysToSave = [];
            licenceFormToSave = {};
            for (const licenceCategoryApproval of licenceCategory.licenceCategoryApprovals) {
                licenceApprovalKeysToSave.push(licenceCategoryApproval.licenceApprovalKey);
                licenceFormToSave["approval--" + licenceCategoryApproval.licenceApprovalKey] = "true";
            }
            saveLicenceApprovals(licenceId, licenceApprovalKeysToSave, licenceFormToSave);
        }
        if (licenceRow.LGMA_AMOUNT > 0) {
            addLicenceTransaction({
                licenceId: licenceId,
                transactionAmount: licenceRow.LGMA_AMOUNT,
                transactionDateString: licenceRow.LGMA_ISS_YR === 0
                    ? currentYearString + "-01-01"
                    : dateTimeFunctions.dateToString(issueDate),
                externalReceiptNumber: "",
                bankInstitutionNumber: "",
                bankTransitNumber: "",
                bankAccountNumber: "",
                transactionNote: ""
            }, session);
        }
        if (licenceRow.LGMA_ISS_YR > 0) {
            issueLicenceWithDate(licenceId, issueDate, session);
        }
    }
    debug("Licences imported successfully.");
};
const cleanupLicences = () => {
    const database = sqlite(databasePath);
    debug("Standardize \"SAULT STE. MARIE\" licenseeCity.");
    database.prepare("update Licences" +
        " set licenseeCity = 'SAULT STE. MARIE'" +
        " where licenseeCity = 'SAULT STE MARIE'")
        .run();
    database.close();
};
recreateDatabase();
await importLicenceCategories();
await importLicences();
cleanupLicences();
sqlPool.releaseAll();

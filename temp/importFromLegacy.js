import fs from "fs";
import { sqlConfig } from "./sqlConfig.js";
import * as sqlPool from "@cityssm/mssql-multi-pool";
import { licencesDB as databasePath } from "../data/databasePaths.js";
import { initLicencesDB } from "../helpers/databaseInitializer.js";
import { addLicenceCategory } from "../helpers/licencesDB/addLicenceCategory.js";
import { updateLicenceCategory } from "../helpers/licencesDB/updateLicenceCategory.js";
import { addLicenceCategoryFee } from "../helpers/licencesDB/addLicenceCategoryFee.js";
import { updateLicenceCategoryFee } from "../helpers/licencesDB/updateLicenceCategoryFee.js";
const currentYearString = new Date().getFullYear().toString();
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
    try {
        fs.unlinkSync(databasePath);
    }
    catch (error) {
        console.error(error);
        return false;
    }
    initLicencesDB();
    return true;
};
const importLicenceCategories = async () => {
    const sourcePool = await sqlPool.connect(sqlConfig);
    const result = await sourcePool.request()
        .query("select * from Replicator.LCTABL");
    const rows = result.recordset;
    for (const categoryRow of rows) {
        const licenceCategoryKey = addLicenceCategory({
            licenceCategoryKey: categoryRow.LGTA_CATEGORY.trim(),
            licenceCategory: categoryRow.LGTA_CATEGORY_NAME.trim()
        }, session);
        updateLicenceCategory({
            licenceCategoryKey,
            licenceCategory: categoryRow.LGTA_CATEGORY_NAME.trim(),
            bylawNumber: categoryRow.LGTA_BYLAW_NO.trim(),
            licenceLengthFunction: "",
            licenceLengthYears: "1",
            licenceLengthMonths: "0",
            licenceLengthDays: "0",
            printEJS: "ssm-municipalLicence"
        }, session);
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
};
recreateDatabase();
await importLicenceCategories();
sqlPool.releaseAll();

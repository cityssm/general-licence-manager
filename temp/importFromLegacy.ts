import fs from "fs";

import { sqlConfig } from "./sqlConfig.js";
import * as sqlPool from "@cityssm/mssql-multi-pool";

import { licencesDB as databasePath } from "../data/databasePaths.js";
import { initLicencesDB } from "../helpers/databaseInitializer.js";

import { addLicenceCategory } from "../helpers/licencesDB/addLicenceCategory.js";
import { updateLicenceCategory } from "../helpers/licencesDB/updateLicenceCategory.js";
import { addLicenceCategoryFee } from "../helpers/licencesDB/addLicenceCategoryFee.js";
import { updateLicenceCategoryFee } from "../helpers/licencesDB/updateLicenceCategoryFee.js";
import { addLicenceCategoryApproval } from "../helpers/licencesDB/addLicenceCategoryApproval.js";
import { updateLicenceCategoryApproval } from "../helpers/licencesDB/updateLicenceCategoryApproval.js";

import type * as recordTypes from "../types/recordTypes";


interface LCTABL_Row {
  LGTA_CATEGORY: string;
  LGTA_CATEGORY_NAME: string;
  LGTA_BYLAW_NO: string;
  LGTA_LICENCE_FEE: number;
  LGTA_RENEWAL_FEE: number;
  LGTA_REPLACE_FEE: number;
  LGTA_NEW_APPROVALS: string;
  LGTA_RENEWAL_APPROVALS: string;
  LGTA_MESSAGE1: string;
  LGTA_MESSAGE2: string;
  LGTA_MESSAGE3: string;
  LGTA_MESSAGE4: string;
  LGTA_MESSAGE5: string;
  LGTA_MESSAGE6: string;
  LGTA_SEQUENCE: string;
  LGTA_HALFYR_SWITCH: string;
  LGTA_INACTIVE: string;
}


const currentYearString = new Date().getFullYear().toString();


const session: recordTypes.PartialSession = {
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

  } catch (error) {
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

  const rows: LCTABL_Row[] = result.recordset;

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

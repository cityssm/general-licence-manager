import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getLicenceCategoryFields } from "./getLicenceCategoryFields.js";
import { getLicenceCategoryApprovals } from "./getLicenceCategoryApprovals.js";
import { getLicenceCategoryFees } from "./getLicenceCategoryFees.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceCategory = (licenceCategoryKey: string, options: {
  includeApprovals: boolean;
  includeFees: "current" | "all" | false;
  includeFields: boolean;
}): recordTypes.LicenceCategory => {

  const database = sqlite(databasePath, {
    readonly: true
  });

  const licenceCategory: recordTypes.LicenceCategory =
    database.prepare("select licenceCategoryKey, licenceCategory, bylawNumber, printEJS," +
      " licenceLengthFunction, licenceLengthYears, licenceLengthMonths, licenceLengthDays" +
      " from LicenceCategories" +
      " where licenceCategoryKey = ?")
      .get(licenceCategoryKey);

  if (licenceCategory && options.includeApprovals) {

    licenceCategory.licenceCategoryApprovals =
      getLicenceCategoryApprovals(licenceCategoryKey, database);
  }

  if (licenceCategory && options.includeFees) {

    licenceCategory.licenceCategoryFees =
      getLicenceCategoryFees(licenceCategoryKey, options.includeFees, database);
  }

  if (licenceCategory && options.includeFields) {
    licenceCategory.licenceCategoryFields =
      getLicenceCategoryFields(licenceCategoryKey, database);
  }

  database.close();

  return licenceCategory;
};


export default getLicenceCategory;

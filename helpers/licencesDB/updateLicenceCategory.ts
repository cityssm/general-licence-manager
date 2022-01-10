import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";

interface UpdateLicenceCategoryForm {
  licenceCategoryKey: string;
  licenceCategory: string;
  bylawNumber: string;
  printEJS: string;
  licenceLengthYears: string;
  licenceLengthMonths: string;
  licenceLengthDays: string;
}

export const updateLicenceCategory =
  (licenceCategoryForm: UpdateLicenceCategoryForm, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    database
      .prepare("update LicenceCategories" +
        " set licenceCategory = ?," +
        " bylawNumber = ?," +
        " printEJS = ?," +
        " licenceLengthYears = ?," +
        " licenceLengthMonths = ?," +
        " licenceLengthDays = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceCategoryKey = ?")
      .run(licenceCategoryForm.licenceCategory,
        licenceCategoryForm.bylawNumber,
        licenceCategoryForm.printEJS,
        licenceCategoryForm.licenceLengthYears,
        licenceCategoryForm.licenceLengthMonths,
        licenceCategoryForm.licenceLengthDays,
        requestSession.user.userName,
        Date.now(),
        licenceCategoryForm.licenceCategoryKey);

    database.close();

    return true;
  };


export default updateLicenceCategory;

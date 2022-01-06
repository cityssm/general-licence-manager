import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getUnusedLicenceCategoryKey } from "./getUnusedKey.js";

import type * as recordTypes from "../../types/recordTypes";

import type * as expressSession from "express-session";

interface AddLicenceCategoryForm {
  licenceCategory: string;
}

export const addLicenceCategory =
  (licenceCategoryForm: AddLicenceCategoryForm, requestSession: expressSession.Session): string => {

    const licenceCategoryKey = getUnusedLicenceCategoryKey(licenceCategoryForm.licenceCategory);

    const database = sqlite(databasePath);

    database
      .prepare("insert into LicenceCategories" +
        "(licenceCategoryKey, licenceCategory," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
      .run(licenceCategoryKey,
        licenceCategoryForm.licenceCategory,
        requestSession.user.userName,
        Date.now(),
        requestSession.user.userName,
        Date.now());

    database.close();

    return licenceCategoryKey;
  };


export default addLicenceCategory;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceCategoryField = (licenceFieldKey: string, database?: sqlite.Database) => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  const licenceCategoryField: recordTypes.LicenceCategoryField =
    database.prepare("select licenceFieldKey, licenceCategoryKey," +
      " licenceField, licenceFieldDescription," +
      " isRequired, minimumLength, maximumLength, pattern" +
      " from LicenceCategoryFields" +
      " where recordDelete_timeMillis is null" +
      " and licenceFieldKey = ?")
      .get(licenceFieldKey);

  if (doCloseDatabase) {
    database.close();
  }

  return licenceCategoryField;
};


export default getLicenceCategoryField;

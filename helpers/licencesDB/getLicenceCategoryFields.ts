import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLicenceCategoryFields = (licenceCategoryKey: string, database?: sqlite.Database): recordTypes.LicenceCategoryField[] => {

  let doCloseDatabase = false;

  if (!database) {

    database = sqlite(databasePath, {
      readonly: true
    });

    doCloseDatabase = true;
  }

  const licenceCategoryFields: recordTypes.LicenceCategoryField[] =
    database.prepare("select licenceFieldKey, licenceField, licenceFieldDescription," +
      " isRequired, minimumLength, maximumLength, pattern, printKey, orderNumber" +
      " from LicenceCategoryFields" +
      " where recordDelete_timeMillis is null" +
      " and licenceCategoryKey = ?" +
      " order by orderNumber, licenceField")
      .all(licenceCategoryKey);

  if (doCloseDatabase) {
    database.close();
  }

  return licenceCategoryFields;
};


export default getLicenceCategoryFields;

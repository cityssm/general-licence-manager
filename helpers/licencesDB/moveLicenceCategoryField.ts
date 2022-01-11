import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getLicenceCategoryField } from "./getLicenceCategoryField.js";
import { getLicenceCategoryFields } from "./getLicenceCategoryFields.js";

import type * as expressSession from "express-session";


const sql = "update LicenceCategoryFields" +
  " set orderNumber = ?," +
  " recordUpdate_userName = ?," +
  " recordUpdate_timeMillis = ?" +
  " where licenceFieldKey = ?";


export const moveLicenceCategoryField =
  (licenceFieldKey_from: string, licenceFieldKey_to: string, requestSession: expressSession.Session): string => {

    const database = sqlite(databasePath);

    const licenceCategoryField_from = getLicenceCategoryField(licenceFieldKey_from, database);

    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryField_from.licenceCategoryKey, database);

    let expectedOrderNumber = 0;

    for (const licenceCategoryField of licenceCategoryFields) {

      if (licenceCategoryField.licenceFieldKey === licenceFieldKey_from) {
        continue;
      }

      expectedOrderNumber += 1;

      if (licenceCategoryField.licenceFieldKey === licenceFieldKey_to) {
        database.prepare(sql)
          .run(expectedOrderNumber,
            requestSession.user.userName,
            Date.now(),
            licenceFieldKey_from);

        expectedOrderNumber += 1;
      }

      if (licenceCategoryField.orderNumber !== expectedOrderNumber) {
        database.prepare(sql)
          .run(expectedOrderNumber,
            requestSession.user.userName,
            Date.now(),
            licenceCategoryField.licenceFieldKey);
      }
    }

    database.close();

    return licenceCategoryField_from.licenceCategoryKey;
  };


export default moveLicenceCategoryField;

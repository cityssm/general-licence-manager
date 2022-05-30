import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import { getUnusedLicenceAdditionalFeeKey } from "./getUnusedKey.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddLicenceCategoryAdditionalFeeForm {
  licenceCategoryKey: string;
  additionalFee: string;
}

export const addLicenceCategoryAdditionalFee =
  (licenceCategoryAdditionalFeeForm: AddLicenceCategoryAdditionalFeeForm, requestSession: recordTypes.PartialSession): string => {

    const licenceAdditionalFeeKey =
      getUnusedLicenceAdditionalFeeKey(licenceCategoryAdditionalFeeForm.licenceCategoryKey, licenceCategoryAdditionalFeeForm.additionalFee);

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    database
      .prepare("insert into licenceCategoryAdditionalFees" +
        "(licenceAdditionalFeeKey, licenceCategoryKey, additionalFee," +
        " additionalFeeType, additionalFeeNumber, additionalFeeFunction," +
        " isRequired," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(licenceAdditionalFeeKey,
        licenceCategoryAdditionalFeeForm.licenceCategoryKey,
        licenceCategoryAdditionalFeeForm.additionalFee,
        "flat",
        0,
        "",
        0,
        requestSession.user.userName,
        rightNowMillis,
        requestSession.user.userName,
        rightNowMillis);

    database.close();

    return licenceAdditionalFeeKey;
  };


export default addLicenceCategoryAdditionalFee;

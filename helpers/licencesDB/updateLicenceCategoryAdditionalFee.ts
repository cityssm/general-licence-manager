import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLicenceCategoryAdditionalFeeForm {
  licenceAdditionalFeeKey: string;
  additionalFee: string;
  additionalFeeType: string;
  additionalFeeNumber: string;
  additionalFeeFunction?: string;
  isRequired?: string;
}


export const updateLicenceCategoryAdditionalFee =
  (licenceCategoryAdditionalFeeForm: UpdateLicenceCategoryAdditionalFeeForm, requestSession: recordTypes.PartialSession): boolean => {

    const database = sqlite(databasePath);

    database
      .prepare("update LicenceCategoryAdditionalFees" +
        " set additionalFee = ?," +
        " additionalFeeType = ?," +
        " additionalFeeNumber = ?," +
        " additionalFeeFunction = ?," +
        " isRequired = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceAdditionalFeeKey = ?")
      .run(licenceCategoryAdditionalFeeForm.additionalFee,
        licenceCategoryAdditionalFeeForm.additionalFeeType,
        licenceCategoryAdditionalFeeForm.additionalFeeNumber,
        licenceCategoryAdditionalFeeForm.additionalFeeFunction || "",
        licenceCategoryAdditionalFeeForm.isRequired ? 1 : 0,
        requestSession.user.userName,
        Date.now(),
        licenceCategoryAdditionalFeeForm.licenceAdditionalFeeKey);

    database.close();

    return true;
  };


export default updateLicenceCategoryAdditionalFee;

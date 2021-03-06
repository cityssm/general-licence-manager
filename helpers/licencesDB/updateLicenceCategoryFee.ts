import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateLicenceCategoryFeeForm {
  licenceFeeId: number | string;
  effectiveStartDateString: string;
  effectiveEndDateString: string;
  licenceFee: number | string;
  renewalFee: number | string;
  replacementFee: number | string;
}


export const updateLicenceCategoryFee =
  (licenceCategoryFeeForm: UpdateLicenceCategoryFeeForm, requestSession: recordTypes.PartialSession): boolean => {

    const database = sqlite(databasePath);

    database
      .prepare("update LicenceCategoryFees" +
        " set effectiveStartDate = ?," +
        " effectiveEndDate = ?," +
        " licenceFee = ?," +
        " renewalFee = ?," +
        " replacementFee = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceFeeId = ?")
      .run(
        licenceCategoryFeeForm.effectiveStartDateString === ""
          ? undefined
          : dateTimeFunctions.dateStringToInteger(licenceCategoryFeeForm.effectiveStartDateString),
        licenceCategoryFeeForm.effectiveEndDateString === ""
          ? undefined
          : dateTimeFunctions.dateStringToInteger(licenceCategoryFeeForm.effectiveEndDateString),
        licenceCategoryFeeForm.licenceFee,
        licenceCategoryFeeForm.renewalFee === ""
          ? undefined
          : licenceCategoryFeeForm.renewalFee,
        licenceCategoryFeeForm.replacementFee === ""
          ? undefined
          : licenceCategoryFeeForm.replacementFee,
        requestSession.user.userName,
        Date.now(),
        licenceCategoryFeeForm.licenceFeeId);

    database.close();

    return true;
  };


export default updateLicenceCategoryFee;

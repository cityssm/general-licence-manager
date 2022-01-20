import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { saveLicenceFields } from "./saveLicenceFields.js";
import { saveLicenceApprovals } from "./saveLicenceApprovals.js";

import type * as expressSession from "express-session";

interface UpdateLicenceForm {
  licenceId: string;
  licenceNumber: string;
  licenseeName: string;
  licenseeBusinessName: string;
  licenseeAddress1: string;
  licenseeAddress2: string;
  licenseeCity: string;
  licenseeProvince: string;
  licenseePostalCode: string;
  isRenewal?: string;
  startDateString: string;
  endDateString: string;
  licenceFee: string;
  replacementFee: string;
  licenceFieldKeys?: string;
  licenceApprovalKeys?: string;
  [fieldOrApprovalKey: string]: string;
}

export const updateLicence =
  (licenceForm: UpdateLicenceForm, requestSession: expressSession.Session): boolean => {

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    database
      .prepare("update Licences" +
        " set licenceNumber = ?," +
        " licenseeName = ?," +
        " licenseeBusinessName = ?," +
        " licenseeAddress1 = ?," +
        " licenseeAddress2 = ?," +
        " licenseeCity = ?," +
        " licenseeProvince = ?," +
        " licenseePostalCode = ?," +
        " isRenewal = ?," +
        " startDate = ?," +
        " endDate = ?," +
        " licenceFee = ?," +
        " replacementFee = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where licenceId = ?")
      .run(licenceForm.licenceNumber,
        licenceForm.licenseeName,
        licenceForm.licenseeBusinessName,
        licenceForm.licenseeAddress1,
        licenceForm.licenseeAddress2,
        licenceForm.licenseeCity,
        licenceForm.licenseeProvince,
        licenceForm.licenseePostalCode,
        licenceForm.isRenewal ? 1 : 0,
        dateTimeFunctions.dateStringToInteger(licenceForm.startDateString),
        dateTimeFunctions.dateStringToInteger(licenceForm.endDateString),
        licenceForm.licenceFee,
        licenceForm.replacementFee,
        requestSession.user.userName,
        rightNowMillis,
        licenceForm.licenceId);

    if (licenceForm.licenceFieldKeys) {

      database.prepare("delete from LicenceFields where licenceId = ?")
        .run(licenceForm.licenceId);

      const licenceFieldKeys = licenceForm.licenceFieldKeys.split(",");

      saveLicenceFields(licenceForm.licenceId, licenceFieldKeys, licenceForm, database);
    }

    if (licenceForm.licenceApprovalKeys) {

      database.prepare("delete from LicenceApprovals where licenceId = ?")
        .run(licenceForm.licenceId);

      const licenceApprovalKeys = licenceForm.licenceApprovalKeys.split(",");
      saveLicenceApprovals(licenceForm.licenceId, licenceApprovalKeys, licenceForm, database);
    }

    database.close();

    return true;
  };


export default updateLicence;
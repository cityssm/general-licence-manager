import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getNextLicenceNumber } from "./getNextLicenceNumber.js";
import { saveLicenceFields } from "./saveLicenceFields.js";
import { saveLicenceApprovals } from "./saveLicenceApprovals.js";

import type * as expressSession from "express-session";

interface CreateLicenceForm {
  licenceCategoryKey: string;
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

export const createLicence =
  (licenceForm: CreateLicenceForm, requestSession: expressSession.Session): number => {

    const database = sqlite(databasePath);

    let licenceNumber = licenceForm.licenceNumber;

    if (licenceNumber === "") {
      licenceNumber = getNextLicenceNumber(database);
    }

    const rightNowMillis = Date.now();

    const result = database
      .prepare("insert into Licences" +
        "(licenceCategoryKey, licenceNumber," +
        " licenseeName, licenseeBusinessName," +
        " licenseeAddress1, licenseeAddress2," +
        " licenseeCity, licenseeProvince, licenseePostalCode," +
        " isRenewal, startDate, endDate," +
        " licenceFee, replacementFee," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(licenceForm.licenceCategoryKey,
        licenceNumber,
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
        requestSession.user.userName,
        rightNowMillis);

    const licenceId = result.lastInsertRowid as number;

    if (licenceForm.licenceFieldKeys) {
      const licenceFieldKeys = licenceForm.licenceFieldKeys.split(",");
      saveLicenceFields(licenceId, licenceFieldKeys, licenceForm, database);
    }

    if (licenceForm.licenceApprovalKeys) {
      const licenceApprovalKeys = licenceForm.licenceApprovalKeys.split(",");
      saveLicenceApprovals(licenceId, licenceApprovalKeys, licenceForm, database);
    }

    database.close();

    return licenceId;
  };


export default createLicence;

import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getNextLicenceNumber } from "./getNextLicenceNumber.js";
import { addRelatedLicence } from "./addRelatedLicence.js";
import { saveLicenceFields } from "./saveLicenceFields.js";
import { saveLicenceApprovals } from "./saveLicenceApprovals.js";

import type * as recordTypes from "../../types/recordTypes";

interface CreateLicenceForm {
  licenceCategoryKey: string;
  licenceNumber: string;
  relatedLicenceId?: string;
  licenseeName: string;
  licenseeBusinessName: string;
  licenseeAddress1: string;
  licenseeAddress2: string;
  licenseeCity: string;
  licenseeProvince: string;
  licenseePostalCode: string;
  bankInstitutionNumber: string;
  bankTransitNumber: string;
  bankAccountNumber: string;
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
  (licenceForm: CreateLicenceForm, requestSession: recordTypes.PartialSession): number => {

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
        " bankInstitutionNumber, bankTransitNumber, bankAccountNumber," +
        " isRenewal, startDate, endDate," +
        " baseLicenceFee, baseReplacementFee," +
        " licenceFee, replacementFee," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(licenceForm.licenceCategoryKey,
        licenceNumber,
        licenceForm.licenseeName,
        licenceForm.licenseeBusinessName,
        licenceForm.licenseeAddress1,
        licenceForm.licenseeAddress2,
        licenceForm.licenseeCity,
        licenceForm.licenseeProvince,
        licenceForm.licenseePostalCode,
        licenceForm.bankInstitutionNumber,
        licenceForm.bankTransitNumber,
        licenceForm.bankAccountNumber,
        licenceForm.isRenewal ? 1 : 0,
        dateTimeFunctions.dateStringToInteger(licenceForm.startDateString),
        dateTimeFunctions.dateStringToInteger(licenceForm.endDateString),
        licenceForm.licenceFee,
        licenceForm.replacementFee,
        licenceForm.licenceFee,
        licenceForm.replacementFee,
        requestSession.user.userName,
        rightNowMillis,
        requestSession.user.userName,
        rightNowMillis);

    const licenceId = result.lastInsertRowid as number;

    if (licenceForm.relatedLicenceId) {
      addRelatedLicence(licenceId, licenceForm.relatedLicenceId, database);
    }

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

import type { RequestHandler } from "express";

import { getLicenceCategories } from "../../helpers/functions.cache.js";
import { getLicence } from "../../helpers/licencesDB/getLicence.js";

import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (request, response) => {

  let relatedLicence: recordTypes.Licence;

  if (request.query.relatedLicenceId && request.query.relatedLicenceId !== "") {
    relatedLicence = getLicence(request.query.relatedLicenceId as string);
  }

  let licenseeName = request.query.licenseeName as string;
  if ((!licenseeName || licenseeName === "") && relatedLicence) {
    licenseeName = relatedLicence.licenseeName;
  }

  let licenseeBusinessName = request.query.licenseeBusinessName as string;
  if ((!licenseeBusinessName || licenseeBusinessName === "") && relatedLicence) {
    licenseeBusinessName = relatedLicence.licenseeBusinessName;
  }

  let licenseeAddress1 = request.query.licenseeAddress1 as string;
  if ((!licenseeAddress1 || licenseeAddress1 === "") && relatedLicence) {
    licenseeAddress1 = relatedLicence.licenseeAddress1;
  }

  let licenseeAddress2 = request.query.licenseeAddress2 as string;
  if ((!licenseeAddress2 || licenseeAddress2 === "") && relatedLicence) {
    licenseeAddress2 = relatedLicence.licenseeAddress2;
  }

  let licenseeCity = request.query.licenseeCity as string;
  if (!licenseeCity || licenseeCity === "") {
    licenseeCity = relatedLicence
      ? relatedLicence.licenseeCity
      : configFunctions.getProperty("defaults.licenseeCity");
  }

  let licenseeProvince = request.query.licenseeProvince as string;
  if (!licenseeProvince || licenseeProvince === "") {
    licenseeProvince = relatedLicence
      ? relatedLicence.licenseeProvince
      : configFunctions.getProperty("defaults.licenseeProvince");
  }

  let licenseePostalCode = request.query.licenseePostalCode as string;
  if ((!licenseePostalCode || licenseePostalCode === "") && relatedLicence) {
    licenseePostalCode = relatedLicence.licenseePostalCode;
  }

  let bankInstitutionNumber = request.query.bankInstitutionNumber as string;
  if ((!bankInstitutionNumber || bankInstitutionNumber === "") && relatedLicence) {
    bankInstitutionNumber = relatedLicence.bankInstitutionNumber;
  }

  let bankTransitNumber = request.query.bankTransitNumber as string;
  if ((!bankTransitNumber || bankTransitNumber === "") && relatedLicence) {
    bankTransitNumber = relatedLicence.bankTransitNumber;
  }

  let bankAccountNumber = request.query.bankAccountNumber as string;
  if ((!bankAccountNumber || bankAccountNumber === "") && relatedLicence) {
    bankAccountNumber = relatedLicence.bankAccountNumber;
  }

  let bankName: string;

  if (bankInstitutionNumber) {
    bankName = getCanadianBankName(bankInstitutionNumber, bankTransitNumber);
  }


  const licenceCategories = getLicenceCategories();

  let startDateString = request.query.startDateString as string;
  let startDate = 0;
  if (!startDateString || startDateString === "") {
    const currentDate = new Date();
    startDateString = dateTimeFunctions.dateToString(currentDate);
    startDate = dateTimeFunctions.dateToInteger(currentDate);
  } else {
    startDate = dateTimeFunctions.dateStringToInteger(startDateString);
  }

  let isRenewal = false;
  if (request.query.isRenewal && request.query.isRenewal !== "") {
    isRenewal = true;
  }

  const licence: recordTypes.Licence = {
    licenceId: "",
    licenceCategoryKey: request.query.licenceCategoryKey as string,
    licenceNumber: "",
    licenseeName,
    licenseeBusinessName,
    licenseeAddress1,
    licenseeAddress2,
    licenseeCity,
    licenseeProvince,
    licenseePostalCode,
    bankInstitutionNumber,
    bankTransitNumber,
    bankName,
    bankAccountNumber,
    isRenewal,
    startDate,
    startDateString,
    endDateString: "",
    licenceFee: "",
    replacementFee: ""
  };

  response.render("licence-edit", {
    headTitle: configFunctions.getProperty("settings.licenceAlias") + " Create",
    isCreate: true,
    licenceCategories,
    licence,
    relatedLicence
  });
};


export default handler;

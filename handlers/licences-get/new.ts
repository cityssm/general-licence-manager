import type { RequestHandler } from "express";

import { getLicenceCategories } from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (request, response) => {

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

  let licenseeCity = request.query.licenseeCity as string;
  if (!licenseeCity || licenseeCity === "") {
    licenseeCity = configFunctions.getProperty("defaults.licenseeCity");
  }

  let licenseeProvince = request.query.licenseeProvince as string;
  if (!licenseeProvince || licenseeProvince === "") {
    licenseeProvince = configFunctions.getProperty("defaults.licenseeProvince");
  }

  let isRenewal = false;
  if (request.query.isRenewal && request.query.isRenewal !== "") {
    isRenewal = true;
  }

  const licence: recordTypes.Licence = {
    licenceId: "",
    licenceCategoryKey: request.query.licenceCategoryKey as string,
    licenceNumber: "",
    licenseeName: request.query.licenseeName as string,
    licenseeBusinessName: request.query.licenseeBusinessName as string,
    licenseeAddress1: request.query.licenseeAddress1 as string,
    licenseeAddress2: request.query.licenseeAddress2 as string,
    licenseeCity,
    licenseeProvince,
    licenseePostalCode: request.query.licenseePostalCode as string,
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
    licence
  });
};


export default handler;

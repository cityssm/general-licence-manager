import type { RequestHandler } from "express";

import { getLicenceCategories } from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (request, response) => {

  const licenceCategories = getLicenceCategories();

  const currentDate = new Date();

  const licence: recordTypes.Licence = {
    licenceId: "",
    licenceCategoryKey: "",
    licenceNumber: "",
    licenseeName: request.query.licenseeName as string,
    licenseeBusinessName: "",
    licenseeAddress1: "",
    licenseeAddress2: "",
    licenseeCity: configFunctions.getProperty("defaults.licenseeCity"),
    licenseeProvince: configFunctions.getProperty("defaults.licenseeProvince"),
    licenseePostalCode: "",
    isRenewal: false,
    startDate: dateTimeFunctions.dateToInteger(currentDate),
    startDateString: dateTimeFunctions.dateToString(currentDate),
    endDateString: "",
    licenceFee: "",
    replacementFee: ""
  };

  response.render("licence-edit", {
    headTitle: "Licence Create",
    isCreate: true,
    licenceCategories,
    licence
  });
};


export default handler;

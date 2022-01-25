import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

export const handler: RequestHandler = async (request, response) => {

  const licenceLengthFunctionName = request.body.licenceLengthFunction;
  const licenceLengthFunction = configFunctions.getLicenceLengthFunction(licenceLengthFunctionName);

  if (!licenceLengthFunction) {
    return response.json({
      success: false,
      errorMessage: "Unable to find licence length function: " + licenceLengthFunctionName
    });
  }

  const startDateString = request.body.startDateString;
  const startDate = dateTimeFunctions.dateStringToDate(startDateString);

  const endDate = licenceLengthFunction(startDate);

  response.json({
    success: true,
    endDateString: dateTimeFunctions.dateToString(endDate)
  });
};


export default handler;

import type { RequestHandler } from "express";

import { updateLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/updateLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateLicenceCategoryAdditionalFee(request.body, request.session);

  cacheFunctions.clearAll();

  const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(request.body.licenceAdditionalFeeKey);

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee.licenceCategoryKey);

  response.json({
    success,
    licenceCategoryAdditionalFees
  });
};


export default handler;

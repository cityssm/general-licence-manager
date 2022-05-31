import type { RequestHandler } from "express";

import { moveLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/moveLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceAdditionalFeeKey_from = request.body.licenceAdditionalFeeKey_from as string;
  const licenceAdditionalFeeKey_to = request.body.licenceAdditionalFeeKey_to as string;

  const licenceCategoryKey = moveLicenceCategoryAdditionalFee(licenceAdditionalFeeKey_from, licenceAdditionalFeeKey_to, request.session);

  cacheFunctions.clearAll();
  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryKey);

  response.json({
    licenceCategoryAdditionalFees
  });
};


export default handler;

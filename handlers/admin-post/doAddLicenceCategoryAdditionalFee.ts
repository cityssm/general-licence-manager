import type { RequestHandler } from "express";

import { addLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/addLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceApprovalKey = addLicenceCategoryAdditionalFee(request.body, request.session);

  cacheFunctions.clearAll();

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(request.body.licenceCategoryKey);

  response.json({
    success: true,
    licenceCategoryAdditionalFees,
    licenceApprovalKey
  });
};


export default handler;

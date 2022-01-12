import type { RequestHandler } from "express";

import { addLicenceCategoryFee } from "../../helpers/licencesDB/addLicenceCategoryFee.js";
import { getLicenceCategoryFees } from "../../helpers/licencesDB/getLicenceCategoryFees.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceFeeId = addLicenceCategoryFee(request.body.licenceCategoryKey, request.session);

  const licenceCategoryFees = getLicenceCategoryFees(request.body.licenceCategoryKey, "all");

  response.json({
    success: true,
    licenceCategoryFees,
    licenceFeeId
  });
};


export default handler;

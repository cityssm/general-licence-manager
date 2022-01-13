import type { RequestHandler } from "express";

import { moveLicenceCategoryApproval } from "../../helpers/licencesDB/moveLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "../../helpers/licencesDB/getLicenceCategoryApprovals.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceApprovalKey_from = request.body.licenceApprovalKey_from as string;
  const licenceApprovalKey_to = request.body.licenceApprovalKey_to as string;

  const licenceCategoryKey = moveLicenceCategoryApproval(licenceApprovalKey_from, licenceApprovalKey_to, request.session);

  cacheFunctions.clearAll();
  const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryKey);

  response.json({
    licenceCategoryApprovals
  });
};


export default handler;

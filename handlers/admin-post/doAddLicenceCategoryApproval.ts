import type { RequestHandler } from "express";

import { addLicenceCategoryApproval } from "../../helpers/licencesDB/addLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "../../helpers/licencesDB/getLicenceCategoryApprovals.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceApprovalKey = addLicenceCategoryApproval(request.body, request.session);

  const licenceCategoryApprovals = getLicenceCategoryApprovals(request.body.licenceCategoryKey);

  response.json({
    success: true,
    licenceCategoryApprovals,
    licenceApprovalKey
  });
};


export default handler;

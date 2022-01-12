import type { RequestHandler } from "express";

import { deleteLicenceCategoryApproval } from "../../helpers/licencesDB/deleteLicenceCategoryApproval.js";
import { getLicenceCategoryApproval } from "../../helpers/licencesDB/getLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "../../helpers/licencesDB/getLicenceCategoryApprovals.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceApprovalKey = request.body.licenceApprovalKey as string;

  const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey);

  if (licenceCategoryApproval) {
    deleteLicenceCategoryApproval(licenceApprovalKey, request.session);
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);

    response.json({
      success: true,
      licenceCategoryApprovals
    });

  } else {

    response.json({
      success: false
    });
  }
};


export default handler;

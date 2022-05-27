import type { RequestHandler } from "express";

import { getLicenceCategory } from "../../helpers/licencesDB/getLicenceCategory.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceCategory = getLicenceCategory(request.body.licenceCategoryKey, {
    includeApprovals: true,
    includeFees: "all",
    includeFields: true,
    includeAdditionalFees: true
  });

  response.json({
    success: true,
    licenceCategory
  });
};


export default handler;

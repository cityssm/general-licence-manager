import type { RequestHandler } from "express";

import { getLicence } from "../../helpers/licencesDB/getLicence.js";
import { getLicenceCategory } from "../../helpers/licencesDB/getLicenceCategory.js";


export const handler: RequestHandler = (request, response) => {

  const licenceId = Number.parseInt(request.params.licenceId);

  const licence = getLicence(licenceId);

  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey, {
    includeApprovals: false,
    includeFields: false,
    includeFees: false
  });

  return response.render("licence-view", {
    headTitle: "Licence View",
    licence,
    licenceCategory
  });
};


export default handler;

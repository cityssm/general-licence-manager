import type { RequestHandler } from "express";

import { addLicenceCategory } from "../../helpers/licencesDB/addLicenceCategory.js";
import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceCategoryKey = addLicenceCategory({
    licenceCategory: request.body.licenceCategory
  }, request.session);

  const licenceCategories = getLicenceCategories();

  response.json({
    success: true,
    licenceCategories,
    licenceCategoryKey
  });
};


export default handler;

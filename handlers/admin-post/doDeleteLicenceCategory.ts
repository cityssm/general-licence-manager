import type { RequestHandler } from "express";

import { deleteLicenceCategory } from "../../helpers/licencesDB/deleteLicenceCategory.js";
import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceCategoryKey = request.body.licenceCategoryKey as string;

  deleteLicenceCategory(licenceCategoryKey, request.session);

  const licenceCategories = getLicenceCategories();

  response.json({
    success: true,
    licenceCategories
  });
};


export default handler;

import type { RequestHandler } from "express";

import { deleteLicenceCategory } from "../../helpers/licencesDB/deleteLicenceCategory.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceCategoryKey = request.body.licenceCategoryKey as string;

  deleteLicenceCategory(licenceCategoryKey, request.session);

  cacheFunctions.clearAll();
  const licenceCategories = cacheFunctions.getLicenceCategories();

  response.json({
    success: true,
    licenceCategories
  });
};


export default handler;

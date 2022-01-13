import type { RequestHandler } from "express";

import { updateLicenceCategory } from "../../helpers/licencesDB/updateLicenceCategory.js";

import * as cacheFunctions from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateLicenceCategory(request.body, request.session);

  cacheFunctions.clearAll();
  
  response.json({
    success
  });
};


export default handler;

import type { RequestHandler } from "express";

import { updateLicenceCategory } from "../../helpers/licencesDB/updateLicenceCategory.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateLicenceCategory(request.body, request.session);

  response.json({
    success
  });
};


export default handler;

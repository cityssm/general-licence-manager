import type { RequestHandler } from "express";

import { updateLicence } from "../../helpers/licencesDB/updateLicence.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateLicence(request.body, request.session);

  response.json({
    success,
    licenceId: request.body.licenceId
  });
};


export default handler;

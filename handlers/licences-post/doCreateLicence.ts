import type { RequestHandler } from "express";

import { createLicence } from "../../helpers/licencesDB/createLicence.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceId = createLicence(request.body, request.session);

  response.json({
    success: true,
    licenceId
  });
};


export default handler;

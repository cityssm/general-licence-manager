import type { RequestHandler } from "express";

import { issueLicence } from "../../helpers/licencesDB/issueLicence.js";


export const handler: RequestHandler = async (request, response) => {

  const success = issueLicence(request.body.licenceId, request.session);

  response.json({
    success
  });
};


export default handler;

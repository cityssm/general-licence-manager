import type { RequestHandler } from "express";

import { deleteLicence } from "../../helpers/licencesDB/deleteLicence.js";


export const handler: RequestHandler = async (request, response) => {

  const success = deleteLicence(request.body.licenceId, request.session);

  response.json({
    success
  });
};


export default handler;

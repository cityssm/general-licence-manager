import type { RequestHandler } from "express";

import { refreshDatabase } from "../../helpers/licencesDB/refreshDatabase.js";


export const handler: RequestHandler = async (request, response) => {

  const success = refreshDatabase(request.session);

  response.json({
    success
  });
};


export default handler;

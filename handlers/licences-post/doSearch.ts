import type { RequestHandler } from "express";

import { getLicences } from "../../helpers/licencesDB/getLicences.js";


export const handler: RequestHandler = async (request, response) => {

  const licencesResponse = getLicences({
    licenceCategoryKey: request.body.licenceCategoryKey
  }, {
      limit: Number.parseInt(request.body.limit || "-1"),
      offset: Number.parseInt(request.body.offset || "0")
    });

  response.json(licencesResponse);
};


export default handler;
import type { RequestHandler } from "express";

import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";


export const handler: RequestHandler = async (_request, response) => {

  const licenceCategories = getLicenceCategories();

  response.json({
    licenceCategories
  });
};


export default handler;

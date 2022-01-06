import type { RequestHandler } from "express";

import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";


export const handler: RequestHandler = (_request, response) => {

  const licenceCategories = getLicenceCategories();

  response.render("admin-licenceCategories", {
    headTitle: "Licence Categories",
    licenceCategories
  });
};


export default handler;

import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";
import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";


export const handler: RequestHandler = (_request, response) => {

  const licenceCategories = getLicenceCategories();

  response.render("licence-search", {
    headTitle: configFunctions.getProperty("settings.licenceAliasPlural"),
    licenceCategories
  });

};


export default handler;

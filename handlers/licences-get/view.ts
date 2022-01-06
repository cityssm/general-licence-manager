import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";


const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");


export const handler: RequestHandler = (_request, response) => {

  //const licenceID = Number(request.params.licenceID);

  return response.render("licence-view", {
    headTitle: "Licence View"
  });
};


export default handler;

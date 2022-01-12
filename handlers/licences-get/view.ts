import type { RequestHandler } from "express";


export const handler: RequestHandler = (_request, response) => {

  //const licenceID = Number(request.params.licenceID);

  return response.render("licence-view", {
    headTitle: "Licence View"
  });
};


export default handler;

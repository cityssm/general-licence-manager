import type { RequestHandler } from "express";


export const handler: RequestHandler = (_request, response) => {

  response.render("licence-edit", {
    headTitle: "Licence Update",
    isCreate: false
  });
};


export default handler;

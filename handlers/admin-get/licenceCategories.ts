import type { RequestHandler } from "express";


export const handler: RequestHandler = (_request, response) => {

  response.render("admin-licenceCategories", {
    headTitle: "Licence Categories"
  });
};


export default handler;

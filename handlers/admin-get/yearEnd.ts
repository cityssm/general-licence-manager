import type { RequestHandler } from "express";

export const handler: RequestHandler = async (_request, response) => {

  response.render("admin-yearEnd", {
    headTitle: "Year-End Process"
  });
};


export default handler;

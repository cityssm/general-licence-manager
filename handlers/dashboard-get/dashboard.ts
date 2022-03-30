import type { RequestHandler } from "express";

import { getOutstandingBatches } from "../../helpers/licencesDB/getOutstandingBatches.js";


export const handler: RequestHandler = (_request, response) => {

  const batches = getOutstandingBatches();

  response.render("dashboard", {
    headTitle: "Dashboard",
    batches
  });
};


export default handler;

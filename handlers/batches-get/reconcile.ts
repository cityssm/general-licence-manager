import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";
import { getBatchTransactions } from "../../helpers/licencesDB/getBatchTransactions.js";


export const handler: RequestHandler = (request, response) => {

  const batchDate = request.params.batchDate;

  const batchTransactions = getBatchTransactions(batchDate);

  if (batchTransactions.length === 0) {
    return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/dashboard/?error=batchDateHasNoTransactions");
  }

  return response.render("batch-reconcile", {
    headTitle: "Reconcile Batch " + batchTransactions[0].batchDateString,
    batchTransactions
  });
};


export default handler;

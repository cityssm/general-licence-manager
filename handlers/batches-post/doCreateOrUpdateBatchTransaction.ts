import type { RequestHandler } from "express";

import { createOrUpdateBatchTransaction } from "../../helpers/licencesDB/createOrUpdateBatchTransaction.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";


export const handler: RequestHandler = async (request, response) => {

  const results = createOrUpdateBatchTransaction(request.body, request.session);
  results.batchTransactions = getOutstandingBatchTransactions();

  response.json(results);
};


export default handler;

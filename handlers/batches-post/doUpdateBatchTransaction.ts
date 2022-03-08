import type { RequestHandler } from "express";

import { createOrUpdateBatchTransaction } from "../../helpers/licencesDB/createOrUpdateBatchTransaction.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";


export const handler: RequestHandler = async (request, response) => {

  const transactionIndex = createOrUpdateBatchTransaction(request);
  const batchTransactions = getOutstandingBatchTransactions();

  response.json({
    success: typeof(transactionIndex) === "number",
    transactionIndex,
    batchTransactions
  });
};


export default handler;

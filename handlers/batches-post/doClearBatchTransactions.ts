import type { RequestHandler } from "express";

import { clearBatchTransactionsByBatchDate } from "../../helpers/licencesDB/clearBatchTransactionsByBatchDate.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";


export const handler: RequestHandler = async (request, response) => {

  const success = clearBatchTransactionsByBatchDate(request.body.batchDateString, request.session);
  const batchTransactions = getOutstandingBatchTransactions();

  response.json({
    success,
    batchTransactions
  });
};


export default handler;

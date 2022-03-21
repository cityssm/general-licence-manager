import type { RequestHandler } from "express";

import { createOrUpdateBatchTransaction } from "../../helpers/licencesDB/createOrUpdateBatchTransaction.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";


export const handler: RequestHandler = async (request, response) => {

  const licenceId = request.body.licenceId;
  const outstandingBalance = Number.parseFloat(request.body.outstandingBalance);

  const batchDateStrings: string[] = request.body.batchDateStrings;

  const transactionAmount = Math.floor((outstandingBalance / batchDateStrings.length) * 100) / 100;

  let leftoverPennies = Math.round((outstandingBalance - (transactionAmount * batchDateStrings.length)) * 100) / 100;

  for (const batchDateString of batchDateStrings) {

    createOrUpdateBatchTransaction({
      licenceId,
      batchDateString,
      transactionAmount: (transactionAmount + leftoverPennies).toFixed(2)
    }, request.session);

    leftoverPennies = 0;
  }

  const batchTransactions = getOutstandingBatchTransactions();

  response.json({
    success: true,
    batchTransactions
  });
};


export default handler;

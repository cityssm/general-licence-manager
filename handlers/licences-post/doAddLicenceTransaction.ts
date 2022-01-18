import type { RequestHandler } from "express";

import { addLicenceTransaction } from "../../helpers/licencesDB/addLicenceTransaction.js";
import { getLicenceTransactions } from "../../helpers/licencesDB/getLicenceTransactions.js";


export const handler: RequestHandler = async (request, response) => {

  const transactionIndex = addLicenceTransaction(request.body, request.session);
  const licenceTransactions = getLicenceTransactions(request.body.licenceId);

  response.json({
    success: true,
    transactionIndex,
    licenceTransactions
  });
};


export default handler;

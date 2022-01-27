import { deleteLicenceTransaction } from "../../helpers/licencesDB/deleteLicenceTransaction.js";
import { getLicenceTransactions } from "../../helpers/licencesDB/getLicenceTransactions.js";
export const handler = async (request, response) => {
    const success = deleteLicenceTransaction(request.body.licenceId, request.body.transactionIndex, request.session);
    const licenceTransactions = getLicenceTransactions(request.body.licenceId);
    response.json({
        success,
        licenceTransactions
    });
};
export default handler;

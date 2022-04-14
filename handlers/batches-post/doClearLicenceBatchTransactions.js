import { clearBatchTransactionsByLicence } from "../../helpers/licencesDB/clearBatchTransactionsByLicence.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";
export const handler = async (request, response) => {
    const success = clearBatchTransactionsByLicence(request.body.licenceId, request.session);
    const batchTransactions = getOutstandingBatchTransactions();
    response.json({
        success,
        batchTransactions
    });
};
export default handler;
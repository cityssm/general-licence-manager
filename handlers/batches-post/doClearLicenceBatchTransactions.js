import { clearLicenceBatchTransactions } from "../../helpers/licencesDB/clearLicenceBatchTransactions.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";
export const handler = async (request, response) => {
    const success = clearLicenceBatchTransactions(request.body.licenceId, request.session);
    const batchTransactions = getOutstandingBatchTransactions();
    response.json({
        success,
        batchTransactions
    });
};
export default handler;

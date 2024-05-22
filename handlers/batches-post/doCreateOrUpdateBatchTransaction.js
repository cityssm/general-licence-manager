import createOrUpdateBatchTransaction from '../../helpers/licencesDB/createOrUpdateBatchTransaction.js';
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js';
export default function handler(request, response) {
    const results = createOrUpdateBatchTransaction(request.body, request.session);
    results.batchTransactions = getOutstandingBatchTransactions();
    response.json(results);
}

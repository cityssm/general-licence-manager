import createOrUpdateBatchTransaction from '../../database/createOrUpdateBatchTransaction.js';
import getOutstandingBatchTransactions from '../../database/getOutstandingBatchTransactions.js';
export default function handler(request, response) {
    const results = createOrUpdateBatchTransaction(request.body, request.session.user);
    results.batchTransactions = getOutstandingBatchTransactions();
    response.json(results);
}

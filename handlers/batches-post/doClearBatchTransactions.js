import clearBatchTransactionsByBatchDate from '../../database/clearBatchTransactionsByBatchDate.js';
import getOutstandingBatchTransactions from '../../database/getOutstandingBatchTransactions.js';
export default function handler(request, response) {
    const success = clearBatchTransactionsByBatchDate(request.body.batchDateString, request.session.user);
    const batchTransactions = getOutstandingBatchTransactions();
    response.json({
        success,
        batchTransactions
    });
}

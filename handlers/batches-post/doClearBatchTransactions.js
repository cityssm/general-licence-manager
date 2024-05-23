import clearBatchTransactionsByBatchDate from '../../helpers/licencesDB/clearBatchTransactionsByBatchDate.js';
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js';
export default function handler(request, response) {
    const success = clearBatchTransactionsByBatchDate(request.body.batchDateString, request.session.user);
    const batchTransactions = getOutstandingBatchTransactions();
    response.json({
        success,
        batchTransactions
    });
}

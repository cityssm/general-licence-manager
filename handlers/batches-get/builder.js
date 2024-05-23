import getBatchableLicences from '../../database/getBatchableLicences.js';
import getOutstandingBatchTransactions from '../../database/getOutstandingBatchTransactions.js';
export default function handler(_request, response) {
    const licences = getBatchableLicences();
    const batchTransactions = getOutstandingBatchTransactions();
    response.render('batch-builder', {
        headTitle: 'Transaction Batch Builder',
        licences,
        batchTransactions
    });
}

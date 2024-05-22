import getBatchableLicences from '../../helpers/licencesDB/getBatchableLicences.js';
import getOutstandingBatchTransactions from '../../helpers/licencesDB/getOutstandingBatchTransactions.js';
export default function handler(_request, response) {
    const licences = getBatchableLicences();
    const batchTransactions = getOutstandingBatchTransactions();
    response.render('batch-builder', {
        headTitle: 'Transaction Batch Builder',
        licences,
        batchTransactions
    });
}

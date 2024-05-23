import { getBatchTransactions } from '../../database/getBatchTransactions.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default function handler(request, response) {
    const batchDate = request.params.batchDate;
    const batchTransactions = getBatchTransactions(batchDate);
    if (batchTransactions.length === 0) {
        response.redirect(getConfigProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=batchDateHasNoTransactions');
        return;
    }
    response.render('batch-reconcile', {
        headTitle: `Reconcile Batch ${batchTransactions[0].batchDateString}`,
        batchTransactions
    });
}

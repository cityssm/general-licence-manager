import * as configFunctions from '../../helpers/functions.config.js';
import { getBatchTransactions } from '../../database/getBatchTransactions.js';
export default function handler(request, response) {
    const batchDate = request.params.batchDate;
    const batchTransactions = getBatchTransactions(batchDate);
    if (batchTransactions.length === 0) {
        response.redirect(configFunctions.getConfigProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=batchDateHasNoTransactions');
        return;
    }
    response.render('batch-reconcile', {
        headTitle: `Reconcile Batch ${batchTransactions[0].batchDateString}`,
        batchTransactions
    });
}

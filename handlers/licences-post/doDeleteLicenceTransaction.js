import deleteLicenceTransaction from '../../database/deleteLicenceTransaction.js';
import getLicenceTransactions from '../../database/getLicenceTransactions.js';
export default function handler(request, response) {
    const success = deleteLicenceTransaction(request.body.licenceId, request.body.transactionIndex, request.session.user);
    const licenceTransactions = getLicenceTransactions(request.body.licenceId);
    response.json({
        success,
        licenceTransactions
    });
}

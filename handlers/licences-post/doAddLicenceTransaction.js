import addLicenceTransaction from '../../database/addLicenceTransaction.js';
import getLicenceTransactions from '../../database/getLicenceTransactions.js';
export default function handler(request, response) {
    const transactionIndex = addLicenceTransaction(request.body, request.session.user);
    const licenceTransactions = getLicenceTransactions(request.body.licenceId);
    response.json({
        success: true,
        transactionIndex,
        licenceTransactions
    });
}

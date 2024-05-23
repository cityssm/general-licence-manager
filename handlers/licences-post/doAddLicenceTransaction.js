import addLicenceTransaction from '../../helpers/licencesDB/addLicenceTransaction.js';
import getLicenceTransactions from '../../helpers/licencesDB/getLicenceTransactions.js';
export default function handler(request, response) {
    const transactionIndex = addLicenceTransaction(request.body, request.session.user);
    const licenceTransactions = getLicenceTransactions(request.body.licenceId);
    response.json({
        success: true,
        transactionIndex,
        licenceTransactions
    });
}

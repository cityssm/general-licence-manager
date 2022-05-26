import { createOrUpdateBatchTransaction } from "../../helpers/licencesDB/createOrUpdateBatchTransaction.js";
import { getOutstandingBatchTransactions } from "../../helpers/licencesDB/getOutstandingBatchTransactions.js";
export const handler = async (request, response) => {
    const licenceOutstandingBalances = request.body.licenceOutstandingBalances;
    const batchDateStrings = request.body.batchDateStrings;
    for (const licenceOutstandingBalance of licenceOutstandingBalances) {
        const licenceId = licenceOutstandingBalance.licenceId;
        const outstandingBalance = Number.parseFloat(licenceOutstandingBalance.outstandingBalance);
        const transactionAmount = Math.floor((outstandingBalance / batchDateStrings.length) * 100) / 100;
        let leftoverPennies = Math.round((outstandingBalance - (transactionAmount * batchDateStrings.length)) * 100) / 100;
        for (const batchDateString of batchDateStrings) {
            createOrUpdateBatchTransaction({
                licenceId,
                batchDateString,
                transactionAmount: (transactionAmount + leftoverPennies).toFixed(2)
            }, request.session);
            leftoverPennies = 0;
        }
    }
    const batchTransactions = getOutstandingBatchTransactions();
    response.json({
        success: true,
        batchTransactions
    });
};
export default handler;

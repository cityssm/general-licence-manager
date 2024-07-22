import { EFTGenerator } from '@cityssm/eft-generator';
import { dateIntegerToDate, dateStringToDate } from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
import { calculateFileCreationNumber } from './batchHelpers.js';
const batchExportConfig = getConfigProperty('exports.batches');
export default function getBatchExport(outstandingBatchTransactions) {
    const batchDate = dateStringToDate(outstandingBatchTransactions[0].batchDateString);
    const fileCreationNumber = calculateFileCreationNumber(batchDate);
    const eftGenerator = new EFTGenerator({
        fileCreationNumber,
        fileCreationDate: batchDate,
        originatorId: batchExportConfig.config.originatorId,
        originatorLongName: batchExportConfig.config.originatorLongName,
        originatorShortName: batchExportConfig.config.originatorShortName,
        destinationDataCentre: batchExportConfig.config.dataCentre
    });
    for (const transaction of outstandingBatchTransactions) {
        eftGenerator.addDebitTransaction({
            paymentDate: dateIntegerToDate(transaction.batchDate),
            cpaCode: batchExportConfig.config.cpaCode.toString(),
            amount: transaction.transactionAmount,
            bankInstitutionNumber: transaction.bankInstitutionNumber ?? '',
            bankTransitNumber: transaction.bankTransitNumber ?? '',
            bankAccountNumber: transaction.bankAccountNumber ?? '',
            payeeName: transaction.licenseeName +
                (transaction.licenseeBusinessName === ''
                    ? ''
                    : ` - ${transaction.licenseeBusinessName}`)
        });
    }
    const output = eftGenerator.toCPA005();
    return {
        fileContentType: 'text/plain',
        fileName: `batch-${outstandingBatchTransactions[0].batchDate.toString()}.txt`,
        fileData: output
    };
}

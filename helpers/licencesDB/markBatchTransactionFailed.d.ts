import type { PartialSession } from '../../types/recordTypes.js';
export interface MarkBatchTransactionFailedForm {
    licenceId: string;
    transactionIndex: string;
    transactionAmount: string;
    batchDate: string;
    externalReceiptNumber: string;
}
export default function markBatchTransactionFailed(transaction: MarkBatchTransactionFailedForm, requestSession: PartialSession): boolean;

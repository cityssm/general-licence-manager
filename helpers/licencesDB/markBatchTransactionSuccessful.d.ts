import type { PartialSession } from '../../types/recordTypes.js';
export interface MarkBatchTransactionSuccessfulForm {
    licenceId: string;
    transactionIndex: string;
    transactionAmount: string;
    batchDate: string;
    externalReceiptNumber: string;
}
export default function markBatchTransactionSuccessful(transaction: MarkBatchTransactionSuccessfulForm, requestSession: PartialSession): boolean;

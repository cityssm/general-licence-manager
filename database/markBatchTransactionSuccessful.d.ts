export interface MarkBatchTransactionSuccessfulForm {
    licenceId: string;
    transactionIndex: string;
    transactionAmount: string;
    batchDate: string;
    externalReceiptNumber: string;
}
export default function markBatchTransactionSuccessful(transaction: MarkBatchTransactionSuccessfulForm, sessionUser: GLMUser): boolean;

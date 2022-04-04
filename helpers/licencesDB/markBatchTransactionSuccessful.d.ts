import type * as recordTypes from "../../types/recordTypes";
interface TransactionForm {
    licenceId: string;
    transactionIndex: string;
    transactionAmount: string;
    batchDate: string;
    externalReceiptNumber: string;
}
export declare const markBatchTransactionSuccessful: (transaction: TransactionForm, requestSession: recordTypes.PartialSession) => boolean;
export default markBatchTransactionSuccessful;

import type * as recordTypes from "../../types/recordTypes";
interface TransactionForm {
    licenceId: string;
    batchDateString: string;
    transactionAmount: string;
}
export declare const createOrUpdateBatchTransaction: (transactionForm: TransactionForm, requestSession: recordTypes.PartialSession) => number;
export default createOrUpdateBatchTransaction;

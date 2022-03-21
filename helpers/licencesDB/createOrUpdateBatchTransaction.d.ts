import type * as recordTypes from "../../types/recordTypes";
interface TransactionForm {
    licenceId: string | number;
    batchDateString: string;
    transactionAmount: string | number;
}
interface CreateOrUpdateBatchTransactionReturn {
    success: boolean;
    message?: string;
    transactionIndex?: number;
    batchTransactions?: recordTypes.LicenceTransaction[];
}
export declare const createOrUpdateBatchTransaction: (transactionForm: TransactionForm, requestSession: recordTypes.PartialSession) => CreateOrUpdateBatchTransactionReturn;
export default createOrUpdateBatchTransaction;

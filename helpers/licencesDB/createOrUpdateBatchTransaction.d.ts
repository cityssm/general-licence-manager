import type { LicenceTransaction } from '../../types/recordTypes.js';
export interface CreateOrUpdateBatchTransactionForm {
    licenceId: string | number;
    batchDateString: string;
    transactionAmount: string | number;
}
interface CreateOrUpdateBatchTransactionReturn {
    success: boolean;
    message?: string;
    transactionIndex?: number;
    batchTransactions?: LicenceTransaction[];
}
export default function createOrUpdateBatchTransaction(transactionForm: CreateOrUpdateBatchTransactionForm, sessionUser: GLMUser): CreateOrUpdateBatchTransactionReturn;
export {};

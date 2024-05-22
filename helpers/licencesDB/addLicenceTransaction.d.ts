import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceTransactionForm {
    licenceId: number | string;
    transactionAmount: number | string;
    transactionDateString?: string;
    includeInBatch?: string;
    bankTransitNumber: string;
    bankInstitutionNumber?: string;
    bankAccountNumber?: string;
    externalReceiptNumber: string;
    transactionNote: string;
}
export default function addLicenceTransaction(licenceTransactionForm: AddLicenceTransactionForm, requestSession: PartialSession): number;

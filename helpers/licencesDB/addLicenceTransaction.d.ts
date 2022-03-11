import type * as recordTypes from "../../types/recordTypes";
interface AddLicenceTransactionForm {
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
export declare const addLicenceTransaction: (licenceTransactionForm: AddLicenceTransactionForm, requestSession: recordTypes.PartialSession) => number;
export default addLicenceTransaction;

import type * as expressSession from "express-session";
interface AddLicenceTransactionForm {
    licenceId: string;
    transactionAmount: string;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare const addLicenceTransaction: (licenceTransactionForm: AddLicenceTransactionForm, requestSession: expressSession.Session) => number;
export default addLicenceTransaction;

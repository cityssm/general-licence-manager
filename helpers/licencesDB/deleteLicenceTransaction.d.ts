import type * as expressSession from "express-session";
export declare const deleteLicenceTransaction: (licenceId: number | string, transactionIndex: number | string, requestSession: expressSession.Session) => boolean;
export default deleteLicenceTransaction;

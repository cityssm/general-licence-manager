import type * as expressSession from 'express-session';
export default function deleteLicenceTransaction(licenceId: number | string, transactionIndex: number | string, requestSession: expressSession.Session): boolean;

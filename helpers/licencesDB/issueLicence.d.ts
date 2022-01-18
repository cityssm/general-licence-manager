import type * as expressSession from "express-session";
export declare const issueLicence: (licenceId: number | string, requestSession: expressSession.Session) => boolean;
export default issueLicence;

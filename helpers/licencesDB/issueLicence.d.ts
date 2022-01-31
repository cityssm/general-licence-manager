import type * as recordTypes from "../../types/recordTypes";
export declare const issueLicenceWithDate: (licenceId: number | string, issueDate: Date, requestSession: recordTypes.PartialSession) => boolean;
export declare const issueLicence: (licenceId: number | string, requestSession: recordTypes.PartialSession) => boolean;
export default issueLicence;

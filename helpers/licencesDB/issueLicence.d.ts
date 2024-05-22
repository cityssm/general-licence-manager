import type { PartialSession } from '../../types/recordTypes.js';
export declare function issueLicenceWithDate(licenceId: number | string, issueDate: Date, requestSession: PartialSession): boolean;
export default function issueLicence(licenceId: number | string, requestSession: PartialSession): boolean;

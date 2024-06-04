import type { Licence, LicenceApproval, LicenceField } from '../types/recordTypes.js';
export declare function getPrintEJSList(): Promise<string[]>;
export declare function getLicenceFieldByPrintKey(licence: Licence, printKey: string): LicenceField | undefined;
export declare function getLicenceFieldsByPrintKeyPiece(licence: Licence, printKeyPiece: string): LicenceField[];
export declare function getLicenceApprovalByPrintKey(licence: Licence, printKey: string): LicenceApproval | undefined;
export declare function getLicenceLengthEndDateString(licence: Licence): string;

import type * as recordTypes from '../types/recordTypes';
export declare function getPrintEJSList(): Promise<string[]>;
export declare function getLicenceFieldByPrintKey(licence: recordTypes.Licence, printKey: string): recordTypes.LicenceField | undefined;
export declare function getLicenceFieldsByPrintKeyPiece(licence: recordTypes.Licence, printKeyPiece: string): recordTypes.LicenceField[];
export declare function getLicenceApprovalByPrintKey(licence: recordTypes.Licence, printKey: string): recordTypes.LicenceApproval | undefined;
export declare function getLicenceLengthEndDateString(licence: recordTypes.Licence): string;

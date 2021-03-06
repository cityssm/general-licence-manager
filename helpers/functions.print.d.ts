import type * as recordTypes from "../types/recordTypes";
export declare const getPrintEJSList: () => Promise<string[]>;
export declare const getLicenceFieldByPrintKey: (licence: recordTypes.Licence, printKey: string) => recordTypes.LicenceField;
export declare const getLicenceFieldsByPrintKeyPiece: (licence: recordTypes.Licence, printKeyPiece: string) => recordTypes.LicenceField[];
export declare const getLicenceApprovalByPrintKey: (licence: recordTypes.Licence, printKey: string) => recordTypes.LicenceApproval;
export declare const getLicenceLengthEndDateString: (licence: recordTypes.Licence) => string;

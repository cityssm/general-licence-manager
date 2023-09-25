import type { LicenceTransaction } from '../../types/recordTypes.js';
export declare function leftPad(unpaddedString: string, paddingCharacter: string, finalLength: number): string;
export declare function rightPad(unpaddedString: string, paddingCharacter: string, finalLength: number): string;
export declare function calculateFileCreationNumber(batchDate: Date, fileCreationNumberOffset?: number): string;
export declare function calculateCustomerNumber(transaction: LicenceTransaction): string;

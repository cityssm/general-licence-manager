import type * as recordTypes from "../../types/recordTypes";
export declare const getBatchTransactions: (batchDate: number | string, includeOutstandingOnly?: boolean) => recordTypes.LicenceTransaction[];
export default getBatchTransactions;

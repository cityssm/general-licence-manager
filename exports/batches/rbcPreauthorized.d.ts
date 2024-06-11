import type * as recordTypes from '../../types/recordTypes.js';
import type { GetBatchExportReturn } from '../batchExport.js';
export declare const getBatchExport: (outstandingBatchTransactions: recordTypes.LicenceTransaction[]) => GetBatchExportReturn;
export default getBatchExport;

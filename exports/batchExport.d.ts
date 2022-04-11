export interface GetBatchExportReturn {
    fileName: string;
    fileData: string;
    fileContentType: string;
}
export declare const getBatchExport: (batchDate: number) => GetBatchExportReturn;

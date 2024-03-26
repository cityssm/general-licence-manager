export interface GetBatchExportReturn {
    fileName: string;
    fileData: string;
    fileContentType: string;
}
export declare function getBatchExport(batchDate: number): GetBatchExportReturn | undefined;

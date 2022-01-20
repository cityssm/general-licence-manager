interface ReportParameters {
    [parameterName: string]: unknown;
}
export declare const getReportData: (reportName: string, reportParameters?: ReportParameters) => unknown[];
export default getReportData;

interface ReportParameters {
    [parameterName: string]: unknown;
}
export declare const getReportData: (reportName: string, reportParameters?: ReportParameters) => any[];
export default getReportData;

export type ReportParameters = Record<string, string | number>;
export default function getReportData(reportName: string, reportParameters?: ReportParameters): unknown[] | undefined;

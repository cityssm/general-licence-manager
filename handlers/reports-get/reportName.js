import { getReportData } from "../../helpers/licencesDB/getReportData.js";
import papaparse from "papaparse";
export const handler = (request, response) => {
    const reportName = request.params.reportName;
    let rows;
    switch (reportName) {
        default:
            rows = getReportData(reportName, request.query);
            break;
    }
    if (!rows) {
        return response.status(404).json({
            success: false,
            message: "Report Not Found"
        });
    }
    const csv = papaparse.unparse(rows);
    response.setHeader("Content-Disposition", "attachment; filename=" + reportName + "-" + Date.now().toString() + ".csv");
    response.setHeader("Content-Type", "text/csv");
    response.send(csv);
};
export default handler;

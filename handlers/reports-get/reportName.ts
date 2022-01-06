import type { RequestHandler } from "express";

// import * as configFunctions from "../../helpers/functions.config.js";


export const handler: RequestHandler = (request, response) => {

  // const reportName = request.params.reportName;

  /*
  const csv = rawToCSV(rowsColumnsObject);

  response.setHeader("Content-Disposition",
    "attachment; filename=" + reportName + "-" + Date.now().toString() + ".csv");

  response.setHeader("Content-Type", "text/csv");

  response.send(csv);
  */
};


export default handler;

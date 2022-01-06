import type { RequestHandler } from "express";

import path from "path";
import * as ejs from "ejs";

import * as configFunctions from "../../helpers/functions.config.js";

import convertHTMLToPDF from "pdf-puppeteer";


const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");

const __dirname = ".";


export const handler: RequestHandler = async(request, response, next) => {

/*
  const reportPath = path.join(__dirname, "reports", printTemplate);

  const pdfCallbackFunction = (pdf: Buffer) => {

    response.setHeader("Content-Disposition",
      "attachment;" +
      " filename=licence-" + licenceID.toString() + "-" + licence.recordUpdate_timeMillis.toString() + ".pdf"
    );

    response.setHeader("Content-Type", "application/pdf");

    response.send(pdf);
  };

  await ejs.renderFile(
    reportPath, {
      configFunctions,
      licence,
      licenceTicketTypeSummary,
      organization
    }, {},
    async(ejsError, ejsData) => {

      if (ejsError) {
        return next(ejsError);
      }

      await convertHTMLToPDF(ejsData, pdfCallbackFunction, {
        format: "letter",
        printBackground: true,
        preferCSSPageSize: true
      });

      return;
    }
  );
  */
};


export default handler;

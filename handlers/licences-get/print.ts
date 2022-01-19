import type { RequestHandler } from "express";

import path from "path";
import * as ejs from "ejs";

import { getLicence } from "../../helpers/licencesDB/getLicence.js";
import { getLicenceCategory } from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

import convertHTMLToPDF from "pdf-puppeteer";


export const handler: RequestHandler = async(request, response, next) => {

  const licenceId = request.params.licenceId;

  const licence = getLicence(licenceId);

  if (!licence || !licence.issueDate) {
    return next("Licence not available for printing.");
  }

  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey);

  const reportPath = path.join(".", "print", licenceCategory.printEJS + ".ejs");

  const pdfCallbackFunction = (pdf: Buffer) => {

    response.setHeader("Content-Disposition",
      "attachment;" +
      " filename=licence-" + licenceId + "-" + licence.recordUpdate_timeMillis.toString() + ".pdf"
    );

    response.setHeader("Content-Type", "application/pdf");

    response.send(pdf);
  };

  await ejs.renderFile(
    reportPath, {
      configFunctions,
      licence,
      licenceCategory
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
};


export default handler;

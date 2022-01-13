import type { RequestHandler } from "express";

import * as cacheFunctions from "../../helpers/functions.cache.js";
import { getPrintEJSList } from "../../helpers/functions.print.js";

export const handler: RequestHandler = async (_request, response) => {

  cacheFunctions.clearAll();

  const licenceCategories = cacheFunctions.getLicenceCategories();

  const printEJSList = await getPrintEJSList();

  response.render("admin-licenceCategories", {
    headTitle: "Licence Categories",
    licenceCategories,
    printEJSList
  });
};


export default handler;

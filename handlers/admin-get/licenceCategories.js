import * as cacheFunctions from "../../helpers/functions.cache.js";
import * as configFunctions from "../../helpers/functions.config.js";
import { getLicenceLengthFunctionNames } from "../../helpers/functions.config.js";
import { getPrintEJSList } from "../../helpers/functions.print.js";
export const handler = async (_request, response) => {
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    const licenceLengthFunctionNames = getLicenceLengthFunctionNames();
    const printEJSList = await getPrintEJSList();
    response.render("admin-licenceCategories", {
        headTitle: configFunctions.getProperty("settings.licenceAlias") + " Categories",
        licenceCategories,
        licenceLengthFunctionNames,
        printEJSList
    });
};
export default handler;

import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
import { getPrintEJSList } from "../../helpers/functions.print.js";
export const handler = async (_request, response) => {
    const licenceCategories = getLicenceCategories();
    const printEJSList = await getPrintEJSList();
    response.render("admin-licenceCategories", {
        headTitle: "Licence Categories",
        licenceCategories,
        printEJSList
    });
};
export default handler;

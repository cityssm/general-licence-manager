import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
export const handler = (_request, response) => {
    const licenceCategories = getLicenceCategories();
    response.render("licence-search", {
        headTitle: "Licences",
        licenceCategories
    });
};
export default handler;

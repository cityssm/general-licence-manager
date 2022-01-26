import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
import { getLicenceStats } from "../../helpers/licencesDB/getLicenceStats.js";
export const handler = (_request, response) => {
    const licenceCategories = getLicenceCategories();
    const licenceStats = getLicenceStats();
    response.render("licence-licenceCategorySummary", {
        headTitle: "Licence Category Summary",
        licenceCategories,
        licenceStats
    });
};
export default handler;

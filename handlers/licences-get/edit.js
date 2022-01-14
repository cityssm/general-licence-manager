import { getLicence } from "../../helpers/licencesDB/getLicence.js";
import { getLicenceCategory } from "../../helpers/licencesDB/getLicenceCategory.js";
export const handler = (request, response) => {
    const licenceId = request.params.licenceId;
    const licence = getLicence(licenceId);
    const licenceCategory = getLicenceCategory(licence.licenceCategoryKey, {
        includeApprovals: false,
        includeFields: false,
        includeFees: "current"
    });
    response.render("licence-edit", {
        headTitle: "Licence Update",
        isCreate: false,
        licence,
        licenceCategories: [licenceCategory]
    });
};
export default handler;

import { deleteLicenceCategory } from "../../helpers/licencesDB/deleteLicenceCategory.js";
import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
export const handler = async (request, response) => {
    const licenceCategoryKey = request.body.licenceCategoryKey;
    deleteLicenceCategory(licenceCategoryKey, request.session);
    const licenceCategories = getLicenceCategories();
    response.json({
        success: true,
        licenceCategories
    });
};
export default handler;

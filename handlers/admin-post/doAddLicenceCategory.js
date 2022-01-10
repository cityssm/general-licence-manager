import { addLicenceCategory } from "../../helpers/licencesDB/addLicenceCategory.js";
import { getLicenceCategories } from "../../helpers/licencesDB/getLicenceCategories.js";
export const handler = async (request, response) => {
    const licenceCategoryKey = addLicenceCategory(request.body, request.session);
    const licenceCategories = getLicenceCategories();
    response.json({
        success: true,
        licenceCategories,
        licenceCategoryKey
    });
};
export default handler;

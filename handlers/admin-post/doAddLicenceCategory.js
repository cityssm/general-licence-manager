import { addLicenceCategory } from "../../helpers/licencesDB/addLicenceCategory.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceCategoryKey = addLicenceCategory(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    response.json({
        success: true,
        licenceCategories,
        licenceCategoryKey
    });
};
export default handler;

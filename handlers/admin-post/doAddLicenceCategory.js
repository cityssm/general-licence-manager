import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategory from '../../helpers/licencesDB/addLicenceCategory.js';
export default function handler(request, response) {
    const licenceCategoryKey = addLicenceCategory(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    response.json({
        success: true,
        licenceCategories,
        licenceCategoryKey
    });
}

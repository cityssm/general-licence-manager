import * as cacheFunctions from '../../helpers/functions.cache.js';
import deleteLicenceCategory from '../../database/deleteLicenceCategory.js';
export default function handler(request, response) {
    const licenceCategoryKey = request.body.licenceCategoryKey;
    deleteLicenceCategory(licenceCategoryKey, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    response.json({
        success: true,
        licenceCategories
    });
}

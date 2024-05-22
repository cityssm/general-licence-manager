import * as cacheFunctions from '../../helpers/functions.cache.js';
import updateLicenceCategory from '../../helpers/licencesDB/updateLicenceCategory.js';
export default function handler(request, response) {
    const success = updateLicenceCategory(request.body, request.session);
    cacheFunctions.clearAll();
    response.json({
        success
    });
}

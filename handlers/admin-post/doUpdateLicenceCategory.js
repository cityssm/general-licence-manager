import * as cacheFunctions from '../../helpers/functions.cache.js';
import updateLicenceCategory from '../../database/updateLicenceCategory.js';
export default function handler(request, response) {
    const success = updateLicenceCategory(request.body, request.session.user);
    cacheFunctions.clearAll();
    response.json({
        success
    });
}

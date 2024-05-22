import * as cacheFunctions from '../../helpers/functions.cache.js';
export default function handler(_request, response) {
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    response.json({
        licenceCategories
    });
}

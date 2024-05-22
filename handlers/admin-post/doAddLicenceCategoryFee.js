import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategoryFee from '../../helpers/licencesDB/addLicenceCategoryFee.js';
import getLicenceCategoryFees from '../../helpers/licencesDB/getLicenceCategoryFees.js';
export function handler(request, response) {
    const licenceFeeId = addLicenceCategoryFee(request.body.licenceCategoryKey, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryFees = getLicenceCategoryFees(request.body.licenceCategoryKey, 'all');
    response.json({
        success: true,
        licenceCategoryFees,
        licenceFeeId
    });
}
export default handler;

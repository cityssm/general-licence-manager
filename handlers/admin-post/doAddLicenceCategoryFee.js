import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategoryFee from '../../database/addLicenceCategoryFee.js';
import getLicenceCategoryFees from '../../database/getLicenceCategoryFees.js';
export default function handler(request, response) {
    const licenceFeeId = addLicenceCategoryFee(request.body.licenceCategoryKey, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryFees = getLicenceCategoryFees(request.body.licenceCategoryKey, 'all');
    response.json({
        success: true,
        licenceCategoryFees,
        licenceFeeId
    });
}

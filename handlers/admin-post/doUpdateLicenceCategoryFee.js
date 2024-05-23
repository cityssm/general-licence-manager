import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryFee from '../../database/getLicenceCategoryFee.js';
import getLicenceCategoryFees from '../../database/getLicenceCategoryFees.js';
import updateLicenceCategoryFee from '../../database/updateLicenceCategoryFee.js';
export default function handler(request, response) {
    const success = updateLicenceCategoryFee(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryFee = getLicenceCategoryFee(request.body.licenceFeeId);
    const licenceCategoryFees = getLicenceCategoryFees(licenceCategoryFee?.licenceCategoryKey ?? '', 'all');
    response.json({
        success,
        licenceCategoryFees
    });
}

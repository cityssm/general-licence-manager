import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategoryAdditionalFee from '../../database/addLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js';
export default function handler(request, response) {
    const licenceAdditionalFeeKey = addLicenceCategoryAdditionalFee(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryAdditionalFees,
        licenceAdditionalFeeKey
    });
}

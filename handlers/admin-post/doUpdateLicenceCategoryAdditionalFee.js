import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryAdditionalFee from '../../database/getLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js';
import updateLicenceCategoryAdditionalFee from '../../database/updateLicenceCategoryAdditionalFee.js';
export default function handler(request, response) {
    const success = updateLicenceCategoryAdditionalFee(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(request.body.licenceAdditionalFeeKey);
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee.licenceCategoryKey);
    response.json({
        success,
        licenceCategoryAdditionalFees
    });
}

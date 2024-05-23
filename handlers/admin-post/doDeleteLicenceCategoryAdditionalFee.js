import * as cacheFunctions from '../../helpers/functions.cache.js';
import deleteLicenceCategoryAdditionalFee from '../../database/deleteLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFee from '../../database/getLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js';
export default function handler(request, response) {
    const licenceAdditionalFeeKey = request.body.licenceAdditionalFeeKey;
    const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey);
    if (licenceCategoryAdditionalFee === undefined) {
        response.json({
            success: false
        });
    }
    else {
        deleteLicenceCategoryAdditionalFee(licenceAdditionalFeeKey, request.session.user);
        cacheFunctions.clearAll();
        const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryAdditionalFees
        });
    }
}

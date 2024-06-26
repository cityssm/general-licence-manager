import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js';
import moveLicenceCategoryAdditionalFee from '../../database/moveLicenceCategoryAdditionalFee.js';
export default function handler(request, response) {
    const licenceAdditionalFeeKeyFrom = request.body
        .licenceAdditionalFeeKey_from;
    const licenceAdditionalFeeKeyTo = request.body
        .licenceAdditionalFeeKey_to;
    const licenceCategoryKey = moveLicenceCategoryAdditionalFee(licenceAdditionalFeeKeyFrom, licenceAdditionalFeeKeyTo, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryKey);
    response.json({
        licenceCategoryAdditionalFees
    });
}

import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js';
import moveLicenceCategoryAdditionalFee from '../../helpers/licencesDB/moveLicenceCategoryAdditionalFee.js';
export async function handler(request, response) {
    const licenceAdditionalFeeKeyFrom = request.body
        .licenceAdditionalFeeKey_from;
    const licenceAdditionalFeeKeyTo = request.body
        .licenceAdditionalFeeKey_to;
    const licenceCategoryKey = moveLicenceCategoryAdditionalFee(licenceAdditionalFeeKeyFrom, licenceAdditionalFeeKeyTo, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryKey);
    response.json({
        licenceCategoryAdditionalFees
    });
}
export default handler;

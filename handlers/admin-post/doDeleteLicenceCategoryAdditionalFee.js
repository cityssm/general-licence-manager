import * as cacheFunctions from '../../helpers/functions.cache.js';
import deleteLicenceCategoryAdditionalFee from '../../helpers/licencesDB/deleteLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFee from '../../helpers/licencesDB/getLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js';
export default function handler(request, response) {
    const licenceAdditionalFeeKey = request.body.licenceAdditionalFeeKey;
    const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey);
    if (licenceCategoryAdditionalFee === undefined) {
        response.json({
            success: false
        });
    }
    else {
        deleteLicenceCategoryAdditionalFee(licenceAdditionalFeeKey, request.session);
        cacheFunctions.clearAll();
        const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryAdditionalFee.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryAdditionalFees
        });
    }
}

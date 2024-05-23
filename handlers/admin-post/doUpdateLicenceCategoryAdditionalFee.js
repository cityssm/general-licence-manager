import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryAdditionalFee from '../../helpers/licencesDB/getLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js';
import updateLicenceCategoryAdditionalFee from '../../helpers/licencesDB/updateLicenceCategoryAdditionalFee.js';
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

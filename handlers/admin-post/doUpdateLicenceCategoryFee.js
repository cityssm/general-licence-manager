import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryFee from '../../helpers/licencesDB/getLicenceCategoryFee.js';
import getLicenceCategoryFees from '../../helpers/licencesDB/getLicenceCategoryFees.js';
import updateLicenceCategoryFee from '../../helpers/licencesDB/updateLicenceCategoryFee.js';
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

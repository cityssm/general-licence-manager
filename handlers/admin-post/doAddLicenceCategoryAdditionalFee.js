import * as cacheFunctions from '../../helpers/functions.cache.js';
import { addLicenceCategoryAdditionalFee } from '../../helpers/licencesDB/addLicenceCategoryAdditionalFee.js';
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js';
export default async function handler(request, response) {
    const licenceAdditionalFeeKey = addLicenceCategoryAdditionalFee(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryAdditionalFees,
        licenceAdditionalFeeKey
    });
}

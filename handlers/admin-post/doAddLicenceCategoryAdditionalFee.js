import { addLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/addLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceAdditionalFeeKey = addLicenceCategoryAdditionalFee(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryAdditionalFees,
        licenceAdditionalFeeKey
    });
};
export default handler;

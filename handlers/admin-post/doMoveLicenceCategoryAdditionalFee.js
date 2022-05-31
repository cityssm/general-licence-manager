import { moveLicenceCategoryAdditionalFee } from "../../helpers/licencesDB/moveLicenceCategoryAdditionalFee.js";
import { getLicenceCategoryAdditionalFees } from "../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceAdditionalFeeKey_from = request.body.licenceAdditionalFeeKey_from;
    const licenceAdditionalFeeKey_to = request.body.licenceAdditionalFeeKey_to;
    const licenceCategoryKey = moveLicenceCategoryAdditionalFee(licenceAdditionalFeeKey_from, licenceAdditionalFeeKey_to, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(licenceCategoryKey);
    response.json({
        licenceCategoryAdditionalFees
    });
};
export default handler;

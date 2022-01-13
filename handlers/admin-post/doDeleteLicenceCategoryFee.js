import { deleteLicenceCategoryFee } from "../../helpers/licencesDB/deleteLicenceCategoryFee.js";
import { getLicenceCategoryFee } from "../../helpers/licencesDB/getLicenceCategoryFee.js";
import { getLicenceCategoryFees } from "../../helpers/licencesDB/getLicenceCategoryFees.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceFeeId = request.body.licenceFeeId;
    const licenceCategoryFee = getLicenceCategoryFee(licenceFeeId);
    if (licenceCategoryFee) {
        deleteLicenceCategoryFee(licenceFeeId, request.session);
        cacheFunctions.clearAll();
        const licenceCategoryFees = getLicenceCategoryFees(licenceCategoryFee.licenceCategoryKey, "all");
        response.json({
            success: true,
            licenceCategoryFees
        });
    }
    else {
        response.json({
            success: false
        });
    }
};
export default handler;

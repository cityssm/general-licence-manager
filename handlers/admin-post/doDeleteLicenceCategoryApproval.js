import { deleteLicenceCategoryApproval } from "../../helpers/licencesDB/deleteLicenceCategoryApproval.js";
import { getLicenceCategoryApproval } from "../../helpers/licencesDB/getLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "../../helpers/licencesDB/getLicenceCategoryApprovals.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceApprovalKey = request.body.licenceApprovalKey;
    const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey);
    if (licenceCategoryApproval) {
        deleteLicenceCategoryApproval(licenceApprovalKey, request.session);
        cacheFunctions.clearAll();
        const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryApprovals
        });
    }
    else {
        response.json({
            success: false
        });
    }
};
export default handler;

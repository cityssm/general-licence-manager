import { updateLicenceCategoryApproval } from "../../helpers/licencesDB/updateLicenceCategoryApproval.js";
import { getLicenceCategoryApproval } from "../../helpers/licencesDB/getLicenceCategoryApproval.js";
import { getLicenceCategoryApprovals } from "../../helpers/licencesDB/getLicenceCategoryApprovals.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateLicenceCategoryApproval(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryApproval = getLicenceCategoryApproval(request.body.licenceApprovalKey);
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
    response.json({
        success,
        licenceCategoryApprovals
    });
};
export default handler;

import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryApproval from '../../helpers/licencesDB/getLicenceCategoryApproval.js';
import { getLicenceCategoryApprovals } from '../../helpers/licencesDB/getLicenceCategoryApprovals.js';
import updateLicenceCategoryApproval from '../../helpers/licencesDB/updateLicenceCategoryApproval.js';
export function handler(request, response) {
    const success = updateLicenceCategoryApproval(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryApproval = getLicenceCategoryApproval(request.body.licenceApprovalKey);
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
    response.json({
        success,
        licenceCategoryApprovals
    });
}
export default handler;

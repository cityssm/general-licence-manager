import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategoryApproval from '../../database/addLicenceCategoryApproval.js';
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js';
export default function handler(request, response) {
    const licenceApprovalKey = addLicenceCategoryApproval(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryApprovals = getLicenceCategoryApprovals(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryApprovals,
        licenceApprovalKey
    });
}

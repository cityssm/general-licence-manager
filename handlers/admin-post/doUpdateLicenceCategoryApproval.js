import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryApproval from '../../database/getLicenceCategoryApproval.js';
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js';
import updateLicenceCategoryApproval from '../../database/updateLicenceCategoryApproval.js';
export default function handler(request, response) {
    const success = updateLicenceCategoryApproval(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryApproval = getLicenceCategoryApproval(request.body.licenceApprovalKey);
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
    response.json({
        success,
        licenceCategoryApprovals
    });
}

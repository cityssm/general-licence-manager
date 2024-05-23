import * as cacheFunctions from '../../helpers/functions.cache.js';
import deleteLicenceCategoryApproval from '../../database/deleteLicenceCategoryApproval.js';
import getLicenceCategoryApproval from '../../database/getLicenceCategoryApproval.js';
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js';
export default function handler(request, response) {
    const licenceApprovalKey = request.body.licenceApprovalKey;
    const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey);
    if (licenceCategoryApproval === undefined) {
        response.json({
            success: false
        });
    }
    else {
        deleteLicenceCategoryApproval(licenceApprovalKey, request.session.user);
        cacheFunctions.clearAll();
        const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryApprovals
        });
    }
}

import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js';
import moveLicenceCategoryApproval from '../../database/moveLicenceCategoryApproval.js';
export default function handler(request, response) {
    const licenceApprovalKeyFrom = request.body.licenceApprovalKey_from;
    const licenceApprovalKeyTo = request.body.licenceApprovalKey_to;
    const licenceCategoryKey = moveLicenceCategoryApproval(licenceApprovalKeyFrom, licenceApprovalKeyTo, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryKey);
    response.json({
        licenceCategoryApprovals
    });
}

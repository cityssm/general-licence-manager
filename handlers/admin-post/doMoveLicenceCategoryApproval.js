import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryApprovals from '../../helpers/licencesDB/getLicenceCategoryApprovals.js';
import moveLicenceCategoryApproval from '../../helpers/licencesDB/moveLicenceCategoryApproval.js';
export default function handler(request, response) {
    const licenceApprovalKeyFrom = request.body.licenceApprovalKey_from;
    const licenceApprovalKeyTo = request.body.licenceApprovalKey_to;
    const licenceCategoryKey = moveLicenceCategoryApproval(licenceApprovalKeyFrom, licenceApprovalKeyTo, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryKey);
    response.json({
        licenceCategoryApprovals
    });
}

import * as cacheFunctions from '../../helpers/functions.cache.js';
import { deleteLicenceCategoryApproval } from '../../helpers/licencesDB/deleteLicenceCategoryApproval.js';
import getLicenceCategoryApproval from '../../helpers/licencesDB/getLicenceCategoryApproval.js';
import getLicenceCategoryApprovals from '../../helpers/licencesDB/getLicenceCategoryApprovals.js';
export default function handler(request, response) {
    const licenceApprovalKey = request.body.licenceApprovalKey;
    const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey);
    if (licenceCategoryApproval === undefined) {
        response.json({
            success: false
        });
    }
    else {
        deleteLicenceCategoryApproval(licenceApprovalKey, request.session);
        cacheFunctions.clearAll();
        const licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryApproval.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryApprovals
        });
    }
}

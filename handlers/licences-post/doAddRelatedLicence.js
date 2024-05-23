import addRelatedLicence from '../../database/addRelatedLicence.js';
import getLicences from '../../database/getLicences.js';
export default function handler(request, response) {
    const success = addRelatedLicence(request.body.licenceId, request.body.relatedLicenceId);
    const relatedLicences = getLicences({
        relatedLicenceId: request.body.licenceId
    }, {
        limit: -1,
        offset: 0
    }).licences;
    response.json({
        success,
        relatedLicences
    });
}

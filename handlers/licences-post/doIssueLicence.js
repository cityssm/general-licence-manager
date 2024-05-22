import issueLicence from '../../helpers/licencesDB/issueLicence.js';
export default function handler(request, response) {
    const success = issueLicence(request.body.licenceId, request.session);
    response.json({
        success
    });
}

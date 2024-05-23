import issueLicence from '../../database/issueLicence.js';
export default function handler(request, response) {
    const success = issueLicence(request.body.licenceId, request.session.user);
    response.json({
        success
    });
}

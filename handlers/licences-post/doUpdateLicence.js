import updateLicence from '../../helpers/licencesDB/updateLicence.js';
export default function handler(request, response) {
    const success = updateLicence(request.body, request.session);
    response.json({
        success,
        licenceId: request.body.licenceId
    });
}

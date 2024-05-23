import createLicence from '../../helpers/licencesDB/createLicence.js';
export default function handler(request, response) {
    const licenceId = createLicence(request.body, request.session.user);
    response.json({
        success: true,
        licenceId
    });
}

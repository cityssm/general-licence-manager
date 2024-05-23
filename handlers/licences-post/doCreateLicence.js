import createLicence from '../../database/createLicence.js';
export default function handler(request, response) {
    const licenceId = createLicence(request.body, request.session.user);
    response.json({
        success: true,
        licenceId
    });
}

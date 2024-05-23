import deleteLicence from '../../helpers/licencesDB/deleteLicence.js';
export default function handler(request, response) {
    const success = deleteLicence(request.body.licenceId, request.session.user);
    response.json({
        success
    });
}

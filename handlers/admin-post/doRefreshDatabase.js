import refreshDatabase from '../../helpers/licencesDB/refreshDatabase.js';
export default function handler(request, response) {
    const success = refreshDatabase(request.session.user);
    response.json({
        success
    });
}

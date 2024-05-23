import refreshDatabase from '../../database/refreshDatabase.js';
export default function handler(request, response) {
    const success = refreshDatabase(request.session.user);
    response.json({
        success
    });
}

import markBatchTransactionFailed from '../../helpers/licencesDB/markBatchTransactionFailed.js';
export function handler(request, response) {
    const success = markBatchTransactionFailed(request.body, request.session.user);
    response.json({
        success
    });
}
export default handler;

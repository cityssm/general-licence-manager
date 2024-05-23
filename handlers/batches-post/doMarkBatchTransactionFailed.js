import markBatchTransactionFailed from '../../database/markBatchTransactionFailed.js';
export function handler(request, response) {
    const success = markBatchTransactionFailed(request.body, request.session.user);
    response.json({
        success
    });
}
export default handler;

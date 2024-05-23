import markBatchTransactionSuccessful from '../../database/markBatchTransactionSuccessful.js';
export default function handler(request, response) {
    const success = markBatchTransactionSuccessful(request.body, request.session.user);
    response.json({
        success
    });
}

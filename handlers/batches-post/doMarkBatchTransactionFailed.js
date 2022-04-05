import { markBatchTransactionFailed } from "../../helpers/licencesDB/markBatchTransactionFailed.js";
export const handler = async (request, response) => {
    const success = markBatchTransactionFailed(request.body, request.session);
    response.json({
        success
    });
};
export default handler;

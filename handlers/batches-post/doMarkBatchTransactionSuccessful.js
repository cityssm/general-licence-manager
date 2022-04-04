import { markBatchTransactionSuccessful } from "../../helpers/licencesDB/markBatchTransactionSuccessful.js";
export const handler = async (request, response) => {
    const success = markBatchTransactionSuccessful(request.body, request.session);
    response.json({
        success
    });
};
export default handler;

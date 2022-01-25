import { deleteLicence } from "../../helpers/licencesDB/deleteLicence.js";
export const handler = async (request, response) => {
    const success = deleteLicence(request.body.licenceId, request.session);
    response.json({
        success
    });
};
export default handler;

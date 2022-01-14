import { createLicence } from "../../helpers/licencesDB/createLicence.js";
export const handler = async (request, response) => {
    const licenceId = createLicence(request.body, request.session);
    response.json({
        success: true,
        licenceId
    });
};
export default handler;

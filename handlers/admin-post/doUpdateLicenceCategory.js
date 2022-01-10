import { updateLicenceCategory } from "../../helpers/licencesDB/updateLicenceCategory.js";
export const handler = async (request, response) => {
    const success = updateLicenceCategory(request.body, request.session);
    response.json({
        success
    });
};
export default handler;

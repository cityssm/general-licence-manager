import { addLicenceCategoryField } from "../../helpers/licencesDB/addLicenceCategoryField.js";
import { getLicenceCategoryFields } from "../../helpers/licencesDB/getLicenceCategoryFields.js";
export const handler = async (request, response) => {
    const licenceFieldKey = addLicenceCategoryField(request.body, request.session);
    const licenceCategoryFields = getLicenceCategoryFields(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryFields,
        licenceFieldKey
    });
};
export default handler;

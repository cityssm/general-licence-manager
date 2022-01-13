import { addLicenceCategoryField } from "../../helpers/licencesDB/addLicenceCategoryField.js";
import { getLicenceCategoryFields } from "../../helpers/licencesDB/getLicenceCategoryFields.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const licenceFieldKey = addLicenceCategoryField(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryFields = getLicenceCategoryFields(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryFields,
        licenceFieldKey
    });
};
export default handler;

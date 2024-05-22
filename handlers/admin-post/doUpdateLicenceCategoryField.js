import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryField from '../../helpers/licencesDB/getLicenceCategoryField.js';
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js';
import updateLicenceCategoryField from '../../helpers/licencesDB/updateLicenceCategoryField.js';
export function handler(request, response) {
    const success = updateLicenceCategoryField(request.body, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryField = getLicenceCategoryField(request.body.licenceFieldKey);
    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryField.licenceCategoryKey);
    response.json({
        success,
        licenceCategoryFields
    });
}
export default handler;

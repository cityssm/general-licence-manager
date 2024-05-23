import * as cacheFunctions from '../../helpers/functions.cache.js';
import addLicenceCategoryField from '../../helpers/licencesDB/addLicenceCategoryField.js';
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js';
export default function handler(request, response) {
    const licenceFieldKey = addLicenceCategoryField(request.body, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryFields = getLicenceCategoryFields(request.body.licenceCategoryKey);
    response.json({
        success: true,
        licenceCategoryFields,
        licenceFieldKey
    });
}

import * as cacheFunctions from '../../helpers/functions.cache.js';
import { deleteLicenceCategoryField } from '../../helpers/licencesDB/deleteLicenceCategoryField.js';
import getLicenceCategoryField from '../../helpers/licencesDB/getLicenceCategoryField.js';
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js';
export function handler(request, response) {
    const licenceFieldKey = request.body.licenceFieldKey;
    const licenceCategoryField = getLicenceCategoryField(licenceFieldKey);
    if (licenceCategoryField === undefined) {
        response.json({
            success: false
        });
    }
    else {
        deleteLicenceCategoryField(licenceFieldKey, request.session);
        cacheFunctions.clearAll();
        const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryField.licenceCategoryKey);
        response.json({
            success: true,
            licenceCategoryFields
        });
    }
}
export default handler;

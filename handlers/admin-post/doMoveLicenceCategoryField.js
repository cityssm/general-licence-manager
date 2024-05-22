import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js';
import { moveLicenceCategoryField } from '../../helpers/licencesDB/moveLicenceCategoryField.js';
export function handler(request, response) {
    const licenceFieldKeyFrom = request.body.licenceFieldKey_from;
    const licenceFieldKeyTo = request.body.licenceFieldKey_to;
    const licenceCategoryKey = moveLicenceCategoryField(licenceFieldKeyFrom, licenceFieldKeyTo, request.session);
    cacheFunctions.clearAll();
    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey);
    response.json({
        licenceCategoryFields
    });
}
export default handler;

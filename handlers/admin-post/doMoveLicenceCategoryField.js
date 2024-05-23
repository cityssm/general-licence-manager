import * as cacheFunctions from '../../helpers/functions.cache.js';
import getLicenceCategoryFields from '../../database/getLicenceCategoryFields.js';
import moveLicenceCategoryField from '../../database/moveLicenceCategoryField.js';
export default function handler(request, response) {
    const licenceFieldKeyFrom = request.body.licenceFieldKey_from;
    const licenceFieldKeyTo = request.body.licenceFieldKey_to;
    const licenceCategoryKey = moveLicenceCategoryField(licenceFieldKeyFrom, licenceFieldKeyTo, request.session.user);
    cacheFunctions.clearAll();
    const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey);
    response.json({
        licenceCategoryFields
    });
}

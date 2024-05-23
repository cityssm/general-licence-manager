import getLicence from '../../database/getLicence.js';
import getLicenceCategory from '../../database/getLicenceCategory.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default function handler(request, response) {
    const licenceId = request.params.licenceId;
    const licence = getLicence(licenceId);
    if (licence === undefined) {
        response.redirect(getConfigProperty('reverseProxy.urlPrefix') +
            '/licences/?error=licenceIdNotFound');
        return;
    }
    const licenceCategory = getLicenceCategory(licence.licenceCategoryKey, {
        includeApprovals: false,
        includeFields: false,
        includeFees: 'current',
        includeAdditionalFees: true
    });
    response.render('licence-edit', {
        headTitle: `${getConfigProperty('settings.licenceAlias')} Update`,
        isCreate: false,
        licence,
        licenceCategories: [licenceCategory]
    });
}

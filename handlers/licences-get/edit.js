import * as configFunctions from '../../helpers/functions.config.js';
import getLicence from '../../helpers/licencesDB/getLicence.js';
import getLicenceCategory from '../../helpers/licencesDB/getLicenceCategory.js';
export function handler(request, response) {
    const licenceId = request.params.licenceId;
    const licence = getLicence(licenceId);
    if (!licence) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
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
        headTitle: `${configFunctions.getProperty('settings.licenceAlias')} Update`,
        isCreate: false,
        licence,
        licenceCategories: [licenceCategory]
    });
}
export default handler;

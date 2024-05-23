import * as configFunctions from '../../helpers/functions.config.js';
import getLicenceCategories from '../../helpers/licencesDB/getLicenceCategories.js';
export default function handler(_request, response) {
    const licenceCategories = getLicenceCategories();
    response.render('licence-search', {
        headTitle: configFunctions.getConfigProperty('settings.licenceAliasPlural'),
        licenceCategories
    });
}

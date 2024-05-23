import getLicenceCategories from '../../database/getLicenceCategories.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default function handler(_request, response) {
    const licenceCategories = getLicenceCategories();
    response.render('licence-search', {
        headTitle: getConfigProperty('settings.licenceAliasPlural'),
        licenceCategories
    });
}

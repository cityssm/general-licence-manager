import * as configFunctions from "../../helpers/functions.config.js";
import { getLicence } from "../../helpers/licencesDB/getLicence.js";
import { getLicenceCategory } from "../../helpers/licencesDB/getLicenceCategory.js";
export const handler = (request, response) => {
    const licenceId = Number.parseInt(request.params.licenceId);
    const licence = getLicence(licenceId);
    if (!licence) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/licences/?error=licenceIdNotFound");
    }
    const licenceCategory = getLicenceCategory(licence.licenceCategoryKey, {
        includeApprovals: false,
        includeFields: false,
        includeFees: false
    });
    return response.render("licence-view", {
        headTitle: configFunctions.getProperty("settings.licenceAlias") + " #" + licence.licenceNumber,
        licence,
        licenceCategory
    });
};
export default handler;

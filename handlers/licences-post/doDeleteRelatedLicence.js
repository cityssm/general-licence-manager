import { deleteRelatedLicence } from "../../helpers/licencesDB/deleteRelatedLicence.js";
import { getLicences } from "../../helpers/licencesDB/getLicences.js";
export const handler = async (request, response) => {
    const success = deleteRelatedLicence(request.body.licenceId, request.body.relatedLicenceId);
    const relatedLicences = getLicences({
        relatedLicenceId: request.body.licenceId
    }, {
        limit: -1,
        offset: 0
    }).licences;
    response.json({
        success,
        relatedLicences
    });
};
export default handler;

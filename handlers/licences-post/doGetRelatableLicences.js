import { getLicences } from "../../helpers/licencesDB/getLicences.js";
export const handler = async (request, response) => {
    const licences = getLicences({
        notRelatedLicenceId: request.body.licenceId,
        searchString: request.body.searchString
    }, {
        limit: 10,
        offset: 0
    }).licences;
    response.json({
        licences
    });
};
export default handler;

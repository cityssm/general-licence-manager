import { getLicences } from "../../helpers/licencesDB/getLicences.js";
export const handler = async (request, response) => {
    const licencesResponse = getLicences({
        licenceCategoryKey: request.body.licenceCategoryKey,
        licensee: request.body.licensee,
        licenceStatus: request.body.licenceStatus
    }, {
        limit: Number.parseInt(request.body.limit || "-1"),
        offset: Number.parseInt(request.body.offset || "0")
    });
    response.json(licencesResponse);
};
export default handler;

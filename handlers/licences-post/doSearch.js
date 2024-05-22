import getLicences from '../../helpers/licencesDB/getLicences.js';
export default function handler(request, response) {
    const licencesResponse = getLicences({
        licenceCategoryKey: request.body.licenceCategoryKey,
        licenceDetails: request.body.licenceDetails,
        licensee: request.body.licensee,
        licenceStatus: request.body.licenceStatus
    }, {
        limit: Number.parseInt((request.body.limit ?? '-1')),
        offset: Number.parseInt((request.body.offset ?? '0')),
        includeFields: true
    });
    response.json(licencesResponse);
}

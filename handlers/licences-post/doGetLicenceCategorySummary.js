import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getLicences } from "../../helpers/licencesDB/getLicences.js";
export const handler = async (request, response) => {
    const licencesResponse = getLicences({
        licenceCategoryKey: request.body.licenceCategoryKey,
        startDateMin: dateTimeFunctions.dateStringToInteger(request.body.startDateStringMin),
        startDateMax: dateTimeFunctions.dateStringToInteger(request.body.startDateStringMax),
    }, {
        limit: -1,
        offset: 0,
        includeFields: true,
        includeTransactions: true
    });
    response.json(licencesResponse);
};
export default handler;

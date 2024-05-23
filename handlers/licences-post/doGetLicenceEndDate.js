import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getLicenceLengthFunction } from '../../helpers/functions.config.js';
export default function handler(request, response) {
    const licenceLengthFunctionName = request.body.licenceLengthFunction;
    const licenceLengthFunction = getLicenceLengthFunction(licenceLengthFunctionName);
    if (licenceLengthFunction === undefined) {
        response.json({
            success: false,
            errorMessage: `Unable to find licence length function: ${licenceLengthFunctionName}`
        });
        return;
    }
    const startDateString = request.body.startDateString;
    const startDate = dateTimeFunctions.dateStringToDate(startDateString);
    const endDate = licenceLengthFunction(startDate);
    response.json({
        success: true,
        endDateString: dateTimeFunctions.dateToString(endDate)
    });
}

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getLicenceCategories } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { userCanUpdate } from '../../helpers/functions.user.js';
import getOutstandingBatches from '../../database/getOutstandingBatches.js';
const batchUpcomingDays = 5;
export default function handler(request, response) {
    const unfilteredBatches = configFunctions.getConfigProperty('settings.includeBatches') &&
        userCanUpdate(request)
        ? getOutstandingBatches()
        : [];
    const batchUpcomingDateNumber = dateTimeFunctions.dateToInteger(new Date(Date.now() + batchUpcomingDays * 86_400 * 1000));
    const batches = unfilteredBatches.filter((batch) => {
        return batch.batchDate <= batchUpcomingDateNumber;
    });
    const licenceCategories = getLicenceCategories();
    response.render('dashboard', {
        headTitle: 'Dashboard',
        batches,
        licenceCategories
    });
}

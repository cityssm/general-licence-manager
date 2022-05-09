import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getOutstandingBatches } from "../../helpers/licencesDB/getOutstandingBatches.js";
import { getLicenceCategories } from "../../helpers/functions.cache.js";
const batchUpcomingDays = 5;
export const handler = (request, response) => {
    const unfilteredBatches = configFunctions.getProperty("settings.includeBatches") && request.session.user.userProperties.canUpdate
        ? getOutstandingBatches()
        : [];
    const batchUpcomingDateNumber = dateTimeFunctions.dateToInteger(new Date(Date.now() + (batchUpcomingDays * 86400 * 1000)));
    const batches = unfilteredBatches.filter((batch) => {
        return batch.batchDate <= batchUpcomingDateNumber;
    });
    const licenceCategories = getLicenceCategories();
    response.render("dashboard", {
        headTitle: "Dashboard",
        batches,
        licenceCategories
    });
};
export default handler;

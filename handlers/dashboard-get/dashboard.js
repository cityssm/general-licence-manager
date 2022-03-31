import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getOutstandingBatches } from "../../helpers/licencesDB/getOutstandingBatches.js";
const batchUpcomingDays = 5;
export const handler = (_request, response) => {
    const unfilteredBatches = configFunctions.getProperty("settings.includeBatches")
        ? getOutstandingBatches()
        : [];
    const batchUpcomingDateNumber = dateTimeFunctions.dateToInteger(new Date(Date.now() + (batchUpcomingDays * 86400 * 1000)));
    const batches = unfilteredBatches.filter((batch) => {
        return batch.batchDate <= batchUpcomingDateNumber;
    });
    response.render("dashboard", {
        headTitle: "Dashboard",
        batches
    });
};
export default handler;

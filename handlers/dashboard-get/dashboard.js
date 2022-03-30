import { getOutstandingBatches } from "../../helpers/licencesDB/getOutstandingBatches.js";
export const handler = (_request, response) => {
    const batches = getOutstandingBatches();
    response.render("dashboard", {
        headTitle: "Dashboard",
        batches
    });
};
export default handler;

import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = async (_request, response) => {
    cacheFunctions.clearAll();
    const licenceCategories = cacheFunctions.getLicenceCategories();
    response.json({
        licenceCategories
    });
};
export default handler;

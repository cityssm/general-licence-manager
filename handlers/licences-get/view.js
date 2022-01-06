import * as configFunctions from "../../helpers/functions.config.js";
const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
export const handler = (_request, response) => {
    return response.render("licence-view", {
        headTitle: "Licence View"
    });
};
export default handler;

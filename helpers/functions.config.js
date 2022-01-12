import { config } from "../data/config.js";
const configFallbackValues = new Map();
configFallbackValues.set("application.applicationName", "General Licensing System");
configFallbackValues.set("application.logoURL", "/images/stamp.png");
configFallbackValues.set("application.httpPort", 7000);
configFallbackValues.set("reverseProxy.disableCompression", false);
configFallbackValues.set("reverseProxy.disableEtag", false);
configFallbackValues.set("reverseProxy.urlPrefix", "");
configFallbackValues.set("session.cookieName", "general-licence-manager-user-sid");
configFallbackValues.set("session.secret", "cityssm/general-licence-manager");
configFallbackValues.set("session.maxAgeMillis", 60 * 60 * 1000);
configFallbackValues.set("session.doKeepAlive", false);
configFallbackValues.set("users.canLogin", ["administrator"]);
configFallbackValues.set("users.canUpdate", []);
configFallbackValues.set("users.isAdmin", ["administrator"]);
configFallbackValues.set("defaults.licenceNumberFunction", "year-fourDigits");
configFallbackValues.set("defaults.licenseeCity", "");
configFallbackValues.set("defaults.licenseeProvince", "ON");
export function getProperty(propertyName) {
    const propertyNameSplit = propertyName.split(".");
    let currentObject = config;
    for (const propertyNamePiece of propertyNameSplit) {
        if (currentObject[propertyNamePiece]) {
            currentObject = currentObject[propertyNamePiece];
        }
        else {
            return configFallbackValues.get(propertyName);
        }
    }
    return currentObject;
}
export const keepAliveMillis = getProperty("session.doKeepAlive")
    ? Math.max(getProperty("session.maxAgeMillis") / 2, getProperty("session.maxAgeMillis") - (10 * 60 * 1000))
    : 0;

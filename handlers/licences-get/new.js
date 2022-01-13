import { getLicenceCategories } from "../../helpers/functions.cache.js";
import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const handler = (_request, response) => {
    const licenceCategories = getLicenceCategories();
    const currentDate = new Date();
    const licence = {
        licenceId: "",
        licenceCategoryKey: "",
        licenceNumber: "",
        licenseeName: "",
        licenseeBusinessName: "",
        licenseeAddress1: "",
        licenseeAddress2: "",
        licenseeCity: configFunctions.getProperty("defaults.licenseeCity"),
        licenseeProvince: configFunctions.getProperty("defaults.licenseeProvince"),
        licenseePostalCode: "",
        isRenewal: false,
        startDate: dateTimeFunctions.dateToInteger(currentDate),
        startDateString: dateTimeFunctions.dateToString(currentDate),
        endDateString: "",
        licenceFee: "",
        replacementFee: ""
    };
    response.render("licence-edit", {
        headTitle: "Licence Create",
        isCreate: true,
        licenceCategories,
        licence
    });
};
export default handler;

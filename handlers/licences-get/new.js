import { getLicenceCategories } from "../../helpers/functions.cache.js";
import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const handler = (request, response) => {
    const licenceCategories = getLicenceCategories();
    let startDateString = request.query.startDateString;
    let startDate = 0;
    if (!startDateString || startDateString === "") {
        const currentDate = new Date();
        startDateString = dateTimeFunctions.dateToString(currentDate);
        startDate = dateTimeFunctions.dateToInteger(currentDate);
    }
    else {
        startDate = dateTimeFunctions.dateStringToInteger(startDateString);
    }
    let licenseeCity = request.query.licenseeCity;
    if (!licenseeCity || licenseeCity === "") {
        licenseeCity = configFunctions.getProperty("defaults.licenseeCity");
    }
    let licenseeProvince = request.query.licenseeProvince;
    if (!licenseeProvince || licenseeProvince === "") {
        licenseeProvince = configFunctions.getProperty("defaults.licenseeProvince");
    }
    const bankInstitutionNumber = request.query.bankInstitutionNumber;
    const bankTransitNumber = request.query.bankTransitNumber;
    let bankName;
    if (bankInstitutionNumber) {
        bankName = getCanadianBankName(bankInstitutionNumber, bankTransitNumber);
    }
    let isRenewal = false;
    if (request.query.isRenewal && request.query.isRenewal !== "") {
        isRenewal = true;
    }
    const licence = {
        licenceId: "",
        licenceCategoryKey: request.query.licenceCategoryKey,
        licenceNumber: "",
        licenseeName: request.query.licenseeName,
        licenseeBusinessName: request.query.licenseeBusinessName,
        licenseeAddress1: request.query.licenseeAddress1,
        licenseeAddress2: request.query.licenseeAddress2,
        licenseeCity,
        licenseeProvince,
        licenseePostalCode: request.query.licenseePostalCode,
        bankInstitutionNumber,
        bankTransitNumber,
        bankName,
        bankAccountNumber: request.query.bankAccountNumber,
        isRenewal,
        startDate,
        startDateString,
        endDateString: "",
        licenceFee: "",
        replacementFee: ""
    };
    response.render("licence-edit", {
        headTitle: configFunctions.getProperty("settings.licenceAlias") + " Create",
        isCreate: true,
        licenceCategories,
        licence
    });
};
export default handler;

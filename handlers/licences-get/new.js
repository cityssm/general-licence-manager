import { getLicenceCategories } from "../../helpers/functions.cache.js";
import { getLicence } from "../../helpers/licencesDB/getLicence.js";
import { getCanadianBankName } from "@cityssm/get-canadian-bank-name";
import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const handler = (request, response) => {
    let relatedLicence;
    if (request.query.relatedLicenceId && request.query.relatedLicenceId !== "") {
        relatedLicence = getLicence(request.query.relatedLicenceId);
    }
    let licenseeName = request.query.licenseeName;
    if ((!licenseeName || licenseeName === "") && relatedLicence) {
        licenseeName = relatedLicence.licenseeName;
    }
    let licenseeBusinessName = request.query.licenseeBusinessName;
    if ((!licenseeBusinessName || licenseeBusinessName === "") && relatedLicence) {
        licenseeBusinessName = relatedLicence.licenseeBusinessName;
    }
    let licenseeAddress1 = request.query.licenseeAddress1;
    if ((!licenseeAddress1 || licenseeAddress1 === "") && relatedLicence) {
        licenseeAddress1 = relatedLicence.licenseeAddress1;
    }
    let licenseeAddress2 = request.query.licenseeAddress2;
    if ((!licenseeAddress2 || licenseeAddress2 === "") && relatedLicence) {
        licenseeAddress2 = relatedLicence.licenseeAddress2;
    }
    let licenseeCity = request.query.licenseeCity;
    if (!licenseeCity || licenseeCity === "") {
        licenseeCity = relatedLicence
            ? relatedLicence.licenseeCity
            : configFunctions.getProperty("defaults.licenseeCity");
    }
    let licenseeProvince = request.query.licenseeProvince;
    if (!licenseeProvince || licenseeProvince === "") {
        licenseeProvince = relatedLicence
            ? relatedLicence.licenseeProvince
            : configFunctions.getProperty("defaults.licenseeProvince");
    }
    let licenseePostalCode = request.query.licenseePostalCode;
    if ((!licenseePostalCode || licenseePostalCode === "") && relatedLicence) {
        licenseePostalCode = relatedLicence.licenseePostalCode;
    }
    let bankInstitutionNumber = request.query.bankInstitutionNumber;
    if ((!bankInstitutionNumber || bankInstitutionNumber === "") && relatedLicence) {
        bankInstitutionNumber = relatedLicence.bankInstitutionNumber;
    }
    let bankTransitNumber = request.query.bankTransitNumber;
    if ((!bankTransitNumber || bankTransitNumber === "") && relatedLicence) {
        bankTransitNumber = relatedLicence.bankTransitNumber;
    }
    let bankAccountNumber = request.query.bankAccountNumber;
    if ((!bankAccountNumber || bankAccountNumber === "") && relatedLicence) {
        bankAccountNumber = relatedLicence.bankAccountNumber;
    }
    let bankName;
    if (bankInstitutionNumber) {
        bankName = getCanadianBankName(bankInstitutionNumber, bankTransitNumber);
    }
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
    let isRenewal = false;
    if (request.query.isRenewal && request.query.isRenewal !== "") {
        isRenewal = true;
    }
    const licence = {
        licenceId: "",
        licenceCategoryKey: request.query.licenceCategoryKey,
        licenceNumber: "",
        licenseeName,
        licenseeBusinessName,
        licenseeAddress1,
        licenseeAddress2,
        licenseeCity,
        licenseeProvince,
        licenseePostalCode,
        bankInstitutionNumber,
        bankTransitNumber,
        bankName,
        bankAccountNumber,
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
        licence,
        relatedLicence
    });
};
export default handler;

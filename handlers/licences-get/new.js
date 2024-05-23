import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getCanadianBankName } from '@cityssm/get-canadian-bank-name';
import { getLicenceCategories } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import getLicence from '../../helpers/licencesDB/getLicence.js';
function getFirstPopulatedValue(...values) {
    for (const value of values) {
        if ((value ?? '') !== '') {
            return value;
        }
    }
    return '';
}
export default function handler(request, response) {
    let relatedLicence;
    if ((request.query.relatedLicenceId ?? '') !== '') {
        relatedLicence = getLicence(request.query.relatedLicenceId);
    }
    const licenseeName = getFirstPopulatedValue(request.query.licenseeName, relatedLicence?.licenseeName ?? '');
    const licenseeBusinessName = getFirstPopulatedValue(request.query.licenseeBusinessName, relatedLicence?.licenseeBusinessName ?? '');
    const licenseeAddress1 = getFirstPopulatedValue(request.query.licenseeAddress1, relatedLicence?.licenseeAddress1 ?? '');
    const licenseeAddress2 = getFirstPopulatedValue(request.query.licenseeAddress2, relatedLicence?.licenseeAddress2 ?? '');
    const licenseeCity = getFirstPopulatedValue(request.query.licenseeCity, relatedLicence?.licenseeCity ?? '', configFunctions.getConfigProperty('defaults.licenseeCity'));
    const licenseeProvince = getFirstPopulatedValue(request.query.licenseeProvince, relatedLicence?.licenseeProvince ?? '', configFunctions.getConfigProperty('defaults.licenseeProvince'));
    const licenseePostalCode = getFirstPopulatedValue(request.query.licenseePostalCode, relatedLicence?.licenseePostalCode ?? '');
    const bankInstitutionNumber = getFirstPopulatedValue(request.query.bankInstitutionNumber, relatedLicence?.bankInstitutionNumber ?? '');
    const bankTransitNumber = getFirstPopulatedValue(request.query.bankTransitNumber, relatedLicence?.bankTransitNumber ?? '');
    const bankAccountNumber = getFirstPopulatedValue(request.query.bankAccountNumber, relatedLicence?.bankAccountNumber ?? '');
    let bankName = '';
    if (bankInstitutionNumber !== '') {
        bankName = getCanadianBankName(bankInstitutionNumber, bankTransitNumber);
    }
    const licenceCategories = getLicenceCategories();
    let startDateString = request.query.startDateString;
    let startDate = 0;
    if (!startDateString || startDateString === '') {
        const currentDate = new Date();
        startDateString = dateTimeFunctions.dateToString(currentDate);
        startDate = dateTimeFunctions.dateToInteger(currentDate);
    }
    else {
        startDate = dateTimeFunctions.dateStringToInteger(startDateString);
    }
    let isRenewal = false;
    if (request.query.isRenewal && request.query.isRenewal !== '') {
        isRenewal = true;
    }
    const licence = {
        licenceId: '',
        licenceCategoryKey: request.query.licenceCategoryKey,
        licenceNumber: '',
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
        endDateString: '',
        baseLicenceFee: '',
        baseReplacementFee: '',
        licenceFee: '',
        replacementFee: '',
        licenceAdditionalFees: []
    };
    response.render('licence-edit', {
        headTitle: configFunctions.getConfigProperty('settings.licenceAlias') + ' Create',
        isCreate: true,
        licenceCategories,
        licence,
        relatedLicence
    });
}

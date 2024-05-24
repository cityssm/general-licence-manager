import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
import * as cacheFunctions from '../helpers/functions.cache.js';
import * as licenceFunctions from '../helpers/functions.licence.js';
import addRelatedLicence from './addRelatedLicence.js';
import getNextLicenceNumber from './getNextLicenceNumber.js';
import saveLicenceApprovals from './saveLicenceApprovals.js';
import saveLicenceFields from './saveLicenceFields.js';
export default function createLicence(licenceForm, sessionUser) {
    const database = sqlite(databasePath);
    let licenceNumber = licenceForm.licenceNumber;
    const licenceCategory = cacheFunctions.getLicenceCategory(licenceForm.licenceCategoryKey);
    if (licenceNumber === '') {
        licenceNumber = getNextLicenceNumber({
            licenceCategory: licenceCategory.licenceCategory
        }, database);
    }
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into Licences (
        licenceCategoryKey, licenceNumber,
        licenseeName, licenseeBusinessName,
        licenseeAddress1, licenseeAddress2, licenseeCity, licenseeProvince, licenseePostalCode,
        bankInstitutionNumber, bankTransitNumber, bankAccountNumber,
        isRenewal,
        startDate, endDate,
        baseLicenceFee, baseReplacementFee, licenceFee, replacementFee,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(licenceForm.licenceCategoryKey, licenceNumber, licenceForm.licenseeName, licenceForm.licenseeBusinessName, licenceForm.licenseeAddress1, licenceForm.licenseeAddress2, licenceForm.licenseeCity, licenceForm.licenseeProvince, licenceForm.licenseePostalCode, licenceForm.bankInstitutionNumber, licenceForm.bankTransitNumber, licenceForm.bankAccountNumber, licenceForm.isRenewal ? 1 : 0, dateTimeFunctions.dateStringToInteger(licenceForm.startDateString), dateTimeFunctions.dateStringToInteger(licenceForm.endDateString), licenceForm.baseLicenceFee, licenceForm.baseReplacementFee, licenceForm.baseLicenceFee, licenceForm.baseReplacementFee, sessionUser.userName, rightNowMillis, sessionUser.userName, rightNowMillis);
    const licenceId = result.lastInsertRowid;
    if (licenceForm.relatedLicenceId) {
        addRelatedLicence(licenceId, licenceForm.relatedLicenceId, database);
    }
    if (licenceForm.licenceFieldKeys) {
        const licenceFieldKeys = licenceForm.licenceFieldKeys.split(',');
        saveLicenceFields(licenceId, licenceFieldKeys, licenceForm, database);
    }
    if (licenceForm.licenceApprovalKeys) {
        const licenceApprovalKeys = licenceForm.licenceApprovalKeys.split(',');
        saveLicenceApprovals(licenceId, licenceApprovalKeys, licenceForm, database);
    }
    for (const licenceCategoryAdditionalFee of licenceCategory.licenceCategoryAdditionalFees ?? []) {
        if (!licenceCategoryAdditionalFee.isRequired) {
            continue;
        }
        const additionalFeeAmount = licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, licenceForm.baseLicenceFee);
        database
            .prepare(`insert into LicenceAdditionalFees (
          licenceId, licenceAdditionalFeeKey, additionalFeeAmount)
          values (?, ?, ?)`)
            .run(licenceId, licenceCategoryAdditionalFee.licenceAdditionalFeeKey, additionalFeeAmount.toFixed(2));
        database
            .prepare(`update Licences
          set licenceFee = licenceFee + ?
          where licenceId = ?`)
            .run(additionalFeeAmount.toFixed(2), licenceId);
    }
    database.close();
    return licenceId;
}

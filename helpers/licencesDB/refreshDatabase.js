import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import * as cacheFunctions from '../functions.cache.js';
import * as configFunctions from '../functions.config.js';
import * as licenceFunctions from '../functions.licence.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
const userFunction_getCurrentFee = (licenceCategoryKey, feeName) => {
    const licenceCategory = cacheFunctions.getLicenceCategory(licenceCategoryKey);
    const licenceCategoryFee = licenceCategory.licenceCategoryFees[0];
    if (!licenceCategoryFee) {
        return 0;
    }
    return licenceCategoryFee[feeName] || licenceCategoryFee.licenceFee;
};
const userFunction_getEndDate = (licenceCategoryKey, startDateNumber) => {
    const licenceCategory = cacheFunctions.getLicenceCategory(licenceCategoryKey);
    const startDate = dateTimeFunctions.dateIntegerToDate(startDateNumber);
    let endDate = startDate;
    if (licenceCategory.licenceLengthFunction &&
        licenceCategory.licenceLengthFunction !== '') {
        const licenceLengthFunction = configFunctions.getLicenceLengthFunction(licenceCategory.licenceLengthFunction);
        if (licenceLengthFunction) {
            endDate = licenceLengthFunction(startDate);
        }
    }
    else {
        if (licenceCategory.licenceLengthYears > 0) {
            endDate.setFullYear(endDate.getFullYear() + licenceCategory.licenceLengthYears);
            endDate.setDate(endDate.getDate() - 1);
        }
        if (licenceCategory.licenceLengthMonths > 0) {
            endDate.setMonth(endDate.getMonth() + licenceCategory.licenceLengthMonths);
            endDate.setDate(endDate.getDate() - 1);
        }
        if (licenceCategory.licenceLengthDays > 0) {
            endDate.setDate(endDate.getDate() + licenceCategory.licenceLengthDays - 1);
        }
    }
    return dateTimeFunctions.dateToInteger(endDate);
};
export const refreshDatabase = (requestSession) => {
    const database = sqlite(databasePath);
    database.function('userFn_getCurrentFee', userFunction_getCurrentFee);
    database.function('userFn_getEndDate', userFunction_getEndDate);
    database
        .prepare('update Licences' +
        ' set recordDelete_userName  = ?,' +
        ' recordDelete_timeMillis = ?' +
        ' where recordDelete_timeMillis is null' +
        ' and issueDate is null')
        .run(requestSession.user.userName, Date.now());
    database
        .prepare('update LicenceTransactions' +
        ' set recordDelete_userName  = ?,' +
        ' recordDelete_timeMillis = ?' +
        ' where recordDelete_timeMillis is null')
        .run(requestSession.user.userName, Date.now());
    database.prepare('delete from LicenceAdditionalFees').run();
    database.prepare('delete from LicenceApprovals').run();
    const startDateNumber = dateTimeFunctions.dateToInteger(new Date());
    database
        .prepare('update Licences' +
        ' set isRenewal = 1,' +
        " baseLicenceFee = userFn_getCurrentFee(licenceCategoryKey, 'renewalFee')," +
        " baseReplacementFee = userFn_getCurrentFee(licenceCategoryKey, 'replacementFee')," +
        " licenceFee = userFn_getCurrentFee(licenceCategoryKey, 'renewalFee')," +
        " replacementFee = userFn_getCurrentFee(licenceCategoryKey, 'replacementFee')," +
        ' startDate = ?,' +
        ' endDate = userFn_getEndDate(licenceCategoryKey, ?),' +
        ' recordUpdate_userName  = ?,' +
        ' recordUpdate_timeMillis = ?' +
        ' where recordDelete_timeMillis is null' +
        ' and issueDate is not null')
        .run(startDateNumber, startDateNumber, requestSession.user.userName, Date.now());
    const licencesWithFees = database
        .prepare('select licenceId, licenceCategoryKey, baseLicenceFee' +
        ' from Licences' +
        ' where recordDelete_timeMillis is null' +
        ' and licenceCategoryKey in (select licenceCategoryKey from LicenceCategoryAdditionalFees where isRequired = 1 and recordDelete_timeMillis is null)')
        .all();
    for (const licence of licencesWithFees) {
        const licenceCategory = cacheFunctions.getLicenceCategory(licence.licenceCategoryKey);
        for (const licenceCategoryAdditionalFee of licenceCategory.licenceCategoryAdditionalFees) {
            if (!licenceCategoryAdditionalFee.isRequired) {
                continue;
            }
            const additionalFeeAmount = licenceFunctions.calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, licence.baseLicenceFee);
            database
                .prepare('insert into LicenceAdditionalFees' +
                ' (licenceId, licenceAdditionalFeeKey, additionalFeeAmount)' +
                ' values (?, ?, ?)')
                .run(licence.licenceId, licenceCategoryAdditionalFee.licenceAdditionalFeeKey, additionalFeeAmount.toFixed(2));
            database
                .prepare('update Licences' +
                ' set licenceFee = licenceFee + ?' +
                ' where licenceId = ?')
                .run(additionalFeeAmount.toFixed(2), licence.licenceId);
        }
    }
    database
        .prepare('update Licences' +
        ' set issueDate = null,' +
        ' issueTime = null,' +
        ' recordUpdate_userName  = ?,' +
        ' recordUpdate_timeMillis = ?' +
        ' where recordDelete_timeMillis is null' +
        ' and issueDate is not null')
        .run(requestSession.user.userName, Date.now());
    database.close();
    return true;
};
export default refreshDatabase;

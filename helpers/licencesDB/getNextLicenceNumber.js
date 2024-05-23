import sqlite from 'better-sqlite3';
import slugify from 'slugify';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import * as configFunctions from '../functions.config.js';
export function getCategorySlug(licenceCategory, maxLength = 10) {
    let categorySlug = slugify(licenceCategory.toUpperCase()).slice(0, Math.max(0, maxLength + 1));
    if (categorySlug.length <= maxLength) {
        return categorySlug;
    }
    while (categorySlug.lastIndexOf('-') > -1) {
        categorySlug = categorySlug.slice(0, Math.max(0, categorySlug.lastIndexOf('-')));
        if (categorySlug.length <= maxLength) {
            return categorySlug;
        }
    }
    return categorySlug.slice(0, Math.max(0, maxLength));
}
function getCategoryNDigitsLicenceNumber(database, licenceCategory, digits, distinctDigits) {
    const categorySlug = getCategorySlug(licenceCategory, 10);
    const licenceNumberLength = categorySlug.length + 1 + digits;
    database.function('userFn_matchesFormat', (licenceNumber) => {
        return licenceNumber.startsWith(categorySlug + '-') ? 1 : 0;
    });
    database.function('userFn_digits', (licenceNumber) => {
        return licenceNumber.slice(Math.max(0, licenceNumber.lastIndexOf('-') + 1));
    });
    const licenceNumber = distinctDigits
        ? database
            .prepare('select licenceNumber from Licences order by userFn_digits(licenceNumber) desc')
            .pluck()
            .get()
        : database
            .prepare(`select licenceNumber from Licences
            where length(licenceNumber) = ?
            and userFn_matchesFormat(licenceNumber) = 1
            order by licenceNumber desc`)
            .pluck()
            .get(licenceNumberLength);
    if (!licenceNumber) {
        return categorySlug + '-' + '1'.padStart(digits, '0');
    }
    const licenceNumberIndex = Number.parseInt(licenceNumber.slice(Math.max(0, licenceNumber.lastIndexOf('-') + 1)), 10) + 1;
    return (categorySlug + '-' + licenceNumberIndex.toString().padStart(digits, '0'));
}
const getNextYearNDigitsLicenceNumber = (database, digits) => {
    const currentYear = new Date().getFullYear();
    const regularExpression = new RegExp(currentYear.toString() + String.raw `-\d+`);
    const licenceNumberLength = 5 + digits;
    database.function('userFn_matchesFormat', (licenceNumber) => {
        return regularExpression.test(licenceNumber) ? 1 : 0;
    });
    const licenceNumber = database
        .prepare(`select licenceNumber from Licences
        where length(licenceNumber) = ?
        and userFn_matchesFormat(licenceNumber) = 1
        order by licenceNumber desc`)
        .pluck()
        .get(licenceNumberLength);
    if (!licenceNumber) {
        return currentYear.toString() + '-' + '1'.padStart(digits, '0');
    }
    const licenceNumberIndex = Number.parseInt(licenceNumber.split('-')[1]) + 1;
    return (currentYear.toString() +
        '-' +
        licenceNumberIndex.toString().padStart(digits, '0'));
};
export default function getNextLicenceNumber(licenceDetails, database) {
    let doCloseDatabase = false;
    if (!database) {
        database = sqlite(databasePath, {
            readonly: true
        });
        doCloseDatabase = true;
    }
    let licenceNumber = '';
    switch (configFunctions.getConfigProperty('defaults.licenceNumberFunction')) {
        case 'category-fourDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 4, false);
            break;
        }
        case 'category-fiveDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 5, false);
            break;
        }
        case 'category-sixDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 6, false);
            break;
        }
        case 'category-distinctFourDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 4, true);
            break;
        }
        case 'category-distinctFiveDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 5, true);
            break;
        }
        case 'category-distinctSixDigits': {
            licenceNumber = getCategoryNDigitsLicenceNumber(database, licenceDetails.licenceCategory, 6, true);
            break;
        }
        case 'year-fourDigits': {
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 4);
            break;
        }
        case 'year-fiveDigits': {
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 5);
            break;
        }
        case 'year-sixDigits': {
            licenceNumber = getNextYearNDigitsLicenceNumber(database, 6);
            break;
        }
    }
    if (doCloseDatabase) {
        database.close();
    }
    return licenceNumber;
}

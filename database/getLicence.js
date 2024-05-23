import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getCanadianBankName } from '@cityssm/get-canadian-bank-name';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../data/databasePaths.js';
import getLicenceFields from './getLicenceFields.js';
import getLicenceTransactions from './getLicenceTransactions.js';
import getLicences from './getLicences.js';
export default function getLicence(licenceId) {
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function('userFn_dateIntegerToString', dateTimeFunctions.dateIntegerToString);
    database.function('userFn_timeIntegerToString', dateTimeFunctions.timeIntegerToString);
    database.function('userFn_getCanadianBankName', getCanadianBankName);
    const licence = database
        .prepare(`select licenceId, licenceCategoryKey,
        licenceNumber,
        licenseeName, licenseeBusinessName,
        licenseeAddress1, licenseeAddress2, licenseeCity, licenseeProvince, licenseePostalCode,
        isRenewal,
        startDate, userFn_dateIntegerToString(startDate) as startDateString,
        endDate, userFn_dateIntegerToString(endDate) as endDateString,
        issueDate, userFn_dateIntegerToString(issueDate) as issueDateString,
        issueTime, userFn_timeIntegerToString(issueTime) as issueTimeString,
        baseLicenceFee, baseReplacementFee, licenceFee, replacementFee,
        bankInstitutionNumber, bankTransitNumber, bankAccountNumber,
        userFn_getCanadianBankName(bankInstitutionNumber, bankTransitNumber) as bankName,
        recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis
        from Licences
        where recordDelete_timeMillis is null
        and licenceId = ?`)
        .get(licenceId);
    if (licence !== undefined) {
        licence.relatedLicences = getLicences({
            relatedLicenceId: licenceId
        }, {
            limit: -1,
            offset: 0
        }).licences;
        licence.licenceFields = getLicenceFields(licenceId, licence.licenceCategoryKey, database);
        licence.licenceApprovals = database
            .prepare(`select a.licenceApprovalKey,
          1 as isApproved,
          c.licenceApproval, c.licenceApprovalDescription,
          c.isRequiredForNew, c.isRequiredForRenewal,
          c.printKey, c.orderNumber
          from LicenceApprovals a
          left join LicenceCategoryApprovals c on a.licenceApprovalKey = c.LicenceApprovalKey
          where a.licenceId = ?
          union
          select c.licenceApprovalKey,
          0 as isApproved,
          c.licenceApproval, c.licenceApprovalDescription,
          c.isRequiredForNew, c.isRequiredForRenewal,
          c.printKey, c.orderNumber
          from LicenceCategoryApprovals c
          where c.recordDelete_timeMillis is null
          and c.licenceCategoryKey = ?
          and c.licenceApprovalKey not in (select licenceApprovalKey from LicenceApprovals where licenceId = ?)
          order by c.orderNumber, c.licenceApproval`)
            .all(licenceId, licence.licenceCategoryKey, licenceId);
        licence.licenceAdditionalFees = database
            .prepare('select l.licenceAdditionalFeeKey, l.additionalFeeAmount, f.additionalFee, f.isRequired' +
            ' from LicenceAdditionalFees l' +
            ' left join LicenceCategoryAdditionalFees f on l.licenceAdditionalFeeKey = f.licenceAdditionalFeeKey' +
            ' where l.licenceId = ?' +
            ' order by f.orderNumber, f.additionalFee')
            .all(licenceId);
        licence.licenceTransactions = getLicenceTransactions(licenceId, database);
    }
    database.close();
    return licence;
}

import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import getLicenceCategoryAdditionalFees from './getLicenceCategoryAdditionalFees.js';
import getLicenceCategoryApprovals from './getLicenceCategoryApprovals.js';
import getLicenceCategoryFees from './getLicenceCategoryFees.js';
import getLicenceCategoryFields from './getLicenceCategoryFields.js';
export default function getLicenceCategory(licenceCategoryKey, options) {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const licenceCategory = database
        .prepare(`select licenceCategoryKey, licenceCategory, bylawNumber, printEJS,
        licenceLengthFunction, licenceLengthYears, licenceLengthMonths, licenceLengthDays,
        recordDelete_timeMillis
        from LicenceCategories
        where licenceCategoryKey = ?`)
        .get(licenceCategoryKey);
    if (licenceCategory && options.includeApprovals) {
        licenceCategory.licenceCategoryApprovals = getLicenceCategoryApprovals(licenceCategoryKey, database);
    }
    if (licenceCategory && options.includeFees) {
        licenceCategory.licenceCategoryFees = getLicenceCategoryFees(licenceCategoryKey, options.includeFees, database);
    }
    if (licenceCategory && options.includeAdditionalFees) {
        licenceCategory.licenceCategoryAdditionalFees =
            getLicenceCategoryAdditionalFees(licenceCategoryKey, database);
    }
    if (licenceCategory && options.includeFields) {
        licenceCategory.licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey, database);
    }
    database.close();
    return licenceCategory;
}

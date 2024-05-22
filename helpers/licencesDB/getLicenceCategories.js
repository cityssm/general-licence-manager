import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function getLicenceCategories() {
    const currentDate = dateTimeFunctions.dateToInteger(new Date());
    const sql = 'select c.licenceCategoryKey, c.licenceCategory, c.bylawNumber, c.printEJS,' +
        ' c.licenceLengthFunction, c.licenceLengthYears, c.licenceLengthMonths, c.licenceLengthDays,' +
        ' ifnull(f.hasEffectiveFee, 0) as hasEffectiveFee' +
        ' from LicenceCategories c' +
        (' left join (' +
            'select licenceCategoryKey, min(count(effectiveStartDate), 1) as hasEffectiveFee' +
            ' from LicenceCategoryFees f' +
            ' where recordDelete_timeMillis is null' +
            ' and effectiveStartDate <= ?' +
            ' and (effectiveEndDate is null or effectiveEndDate >= ?)' +
            ' group by licenceCategoryKey' +
            ') f on c.licenceCategoryKey = f.licenceCategoryKey') +
        ' where c.recordDelete_timeMillis is null' +
        ' order by c.licenceCategory, c.licenceCategoryKey';
    const database = sqlite(databasePath, {
        readonly: true
    });
    const rows = database
        .prepare(sql)
        .all(currentDate, currentDate);
    database.close();
    return rows;
}

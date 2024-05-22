import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export default function getLicenceStats() {
    const sql = `select min(startDate) as startDateMin,
    max(startDate) as startDateMax
    from Licences
    where recordDelete_timeMillis is null`;
    const database = sqlite(databasePath, {
        readonly: true
    });
    let stats = database.prepare(sql).get();
    database.close();
    if (stats === undefined || stats.startDateMin === null) {
        const currentDate = dateTimeFunctions.dateToInteger(new Date());
        stats = {
            startDateMin: currentDate,
            startDateMax: currentDate
        };
    }
    stats.startDateStringMin = dateTimeFunctions.dateIntegerToString(stats.startDateMin ?? 0);
    stats.startYearMin = Math.floor((stats.startDateMin ?? 0) / 10_000);
    stats.startDateStringMax = dateTimeFunctions.dateIntegerToString(stats.startDateMax);
    stats.startYearMax = Math.floor(stats.startDateMax / 10_000);
    return stats;
}

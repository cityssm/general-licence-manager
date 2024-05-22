import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
export const getLicenceStats = () => {
    const sql = 'select min(startDate) as startDateMin,' +
        ' max(startDate) as startDateMax' +
        ' from Licences' +
        ' where recordDelete_timeMillis is null';
    const database = sqlite(databasePath, {
        readonly: true
    });
    let stats = database.prepare(sql).get();
    database.close();
    if (!stats || !stats.startDateMin) {
        const currentDate = dateTimeFunctions.dateToInteger(new Date());
        stats = {
            startDateMin: currentDate,
            startDateMax: currentDate
        };
    }
    stats.startDateStringMin = dateTimeFunctions.dateIntegerToString(stats.startDateMin);
    stats.startYearMin = Math.floor(stats.startDateMin / 10_000);
    stats.startDateStringMax = dateTimeFunctions.dateIntegerToString(stats.startDateMax);
    stats.startYearMax = Math.floor(stats.startDateMax / 10_000);
    return stats;
};
export default getLicenceStats;

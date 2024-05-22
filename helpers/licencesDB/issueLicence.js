import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export function issueLicenceWithDate(licenceId, issueDate, requestSession) {
    const database = sqlite(databasePath);
    const rightNow = new Date();
    database
        .prepare(`update Licences
        set issueDate = ?,
        issueTime = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?`)
        .run(dateTimeFunctions.dateToInteger(issueDate), dateTimeFunctions.dateToTimeInteger(issueDate), requestSession.user.userName, rightNow.getTime(), licenceId);
    database.close();
    return true;
}
export default function issueLicence(licenceId, requestSession) {
    return issueLicenceWithDate(licenceId, new Date(), requestSession);
}

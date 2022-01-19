import sqlite from "better-sqlite3";
import { licencesDB as databasePath } from "../../data/databasePaths.js";
export const deleteLicence = (licenceId, requestSession) => {
    const database = sqlite(databasePath);
    database.prepare("update Licences" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where licenceId = ?")
        .run(requestSession.user.userName, Date.now(), licenceId);
    database.close();
    return true;
};
export default deleteLicence;

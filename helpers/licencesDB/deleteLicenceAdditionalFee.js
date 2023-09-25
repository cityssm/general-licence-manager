import sqlite from 'better-sqlite3';
import { licencesDB as databasePath } from '../../data/databasePaths.js';
export const deleteLicenceAdditionalFee = (licenceId, licenceAdditionalFeeKey, requestSession) => {
    const database = sqlite(databasePath);
    const licenceFees = database
        .prepare('select licenceFee, additionalFeeAmount' +
        ' from Licences l' +
        ' left join LicenceAdditionalFees f on l.licenceId = f.licenceId' +
        ' where l.licenceId = ?' +
        ' and f.licenceAdditionalFeeKey = ?' +
        ' and l.recordDelete_timeMillis is null')
        .get(licenceId, licenceAdditionalFeeKey);
    const rightNowMillis = Date.now();
    database
        .prepare('delete from LicenceAdditionalFees' +
        ' where licenceId = ?' +
        ' and licenceAdditionalFeeKey = ?')
        .run(licenceId, licenceAdditionalFeeKey);
    const newLicenceFee = licenceFees.licenceFee - licenceFees.additionalFeeAmount;
    database
        .prepare('update Licences' +
        ' set licenceFee = ?,' +
        ' recordUpdate_userName = ?,' +
        ' recordUpdate_timeMillis = ?' +
        ' where licenceId = ?')
        .run(newLicenceFee, requestSession.user.userName, rightNowMillis, licenceId);
    database.close();
    return {
        licenceFee: newLicenceFee
    };
};
export default deleteLicenceAdditionalFee;

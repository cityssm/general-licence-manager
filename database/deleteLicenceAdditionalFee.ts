import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'

interface DeleteLicenceAdditionalFeeReturn {
  licenceFee: number
}

export default function deleteLicenceAdditionalFee(
  licenceId: string | number,
  licenceAdditionalFeeKey: string,
  sessionUser: GLMUser
): DeleteLicenceAdditionalFeeReturn {
  const database = sqlite(databasePath)

  const licenceFees = database
    .prepare(
      `select licenceFee, additionalFeeAmount
        from Licences l
        left join LicenceAdditionalFees f on l.licenceId = f.licenceId
        where l.licenceId = ?
        and f.licenceAdditionalFeeKey = ?
        and l.recordDelete_timeMillis is null`
    )
    .get(licenceId, licenceAdditionalFeeKey) as {
    licenceFee: number
    additionalFeeAmount: number
  }

  const rightNowMillis = Date.now()

  database
    .prepare(
      `delete from LicenceAdditionalFees
        where licenceId = ?
        and licenceAdditionalFeeKey = ?`
    )
    .run(licenceId, licenceAdditionalFeeKey)

  const newLicenceFee = licenceFees.licenceFee - licenceFees.additionalFeeAmount

  database
    .prepare(
      `update Licences
        set licenceFee = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?`
    )
    .run(newLicenceFee, sessionUser.userName, rightNowMillis, licenceId)

  database.close()

  return {
    licenceFee: newLicenceFee
  }
}

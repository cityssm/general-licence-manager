import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../../data/databasePaths.js'
import type {
  LicenceCategoryAdditionalFee,
  PartialSession
} from '../../types/recordTypes.js'
import * as licenceFunctions from '../functions.licence.js'

import { getLicenceCategoryAdditionalFee } from './getLicenceCategoryAdditionalFee.js'

interface AddLicenceAdditionalFeeReturn {
  licenceFee: number
  additionalFeeAmount: number
  licenceCategoryAdditionalFee: LicenceCategoryAdditionalFee
}

export default function addLicenceAdditionalFee(
  licenceId: string | number,
  licenceAdditionalFeeKey: string,
  requestSession: PartialSession
): AddLicenceAdditionalFeeReturn {
  const database = sqlite(databasePath)

  const licenceFees = database
    .prepare(
      `select baseLicenceFee, licenceFee
        from Licences
        where licenceId = ?
        and recordDelete_timeMillis is null`
    )
    .get(licenceId) as {
    baseLicenceFee: number
    licenceFee: number
  }

  const additionalFee = getLicenceCategoryAdditionalFee(
    licenceAdditionalFeeKey,
    database
  ) as LicenceCategoryAdditionalFee

  const additionalFeeAmount = licenceFunctions.calculateAdditionalFeeAmount(
    additionalFee,
    licenceFees.baseLicenceFee
  )

  const rightNowMillis = Date.now()

  database
    .prepare(
      `insert into LicenceAdditionalFees (
        licenceId, licenceAdditionalFeeKey, additionalFeeAmount)
        values (?, ?, ?)`
    )
    .run(licenceId, licenceAdditionalFeeKey, additionalFeeAmount.toFixed(2))

  const newLicenceFee = licenceFees.licenceFee + additionalFeeAmount

  database
    .prepare(
      `update Licences
        set licenceFee = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where licenceId = ?`
    )
    .run(newLicenceFee, requestSession.user.userName, rightNowMillis, licenceId)

  database.close()

  return {
    licenceFee: newLicenceFee,
    additionalFeeAmount,
    licenceCategoryAdditionalFee: additionalFee
  }
}

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'

import { licencesDB as databasePath } from '../data/databasePaths.js'

interface LicenceStats {
  startDateMin: number | null
  startDateStringMin?: string
  startYearMin?: number

  startDateMax: number
  startDateStringMax?: string
  startYearMax?: number
}

export default function getLicenceStats(): LicenceStats {
  const sql = `select min(startDate) as startDateMin,
    max(startDate) as startDateMax
    from Licences
    where recordDelete_timeMillis is null`

  const database = sqlite(databasePath, {
    readonly: true
  })

  let stats = database.prepare(sql).get() as LicenceStats | undefined

  database.close()

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (stats === undefined || stats.startDateMin === null) {
    const currentDate = dateTimeFunctions.dateToInteger(new Date())
    stats = {
      startDateMin: currentDate,
      startDateMax: currentDate
    }
  }

  stats.startDateStringMin = dateTimeFunctions.dateIntegerToString(
    stats.startDateMin ?? 0
  )
  stats.startYearMin = Math.floor((stats.startDateMin ?? 0) / 10_000)

  stats.startDateStringMax = dateTimeFunctions.dateIntegerToString(
    stats.startDateMax
  )
  stats.startYearMax = Math.floor(stats.startDateMax / 10_000)

  return stats
}

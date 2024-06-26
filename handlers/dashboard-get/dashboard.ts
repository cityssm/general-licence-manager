import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { Request, Response } from 'express'

import getOutstandingBatches from '../../database/getOutstandingBatches.js'
import { getLicenceCategories } from '../../helpers/functions.cache.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import { userCanUpdate } from '../../helpers/functions.user.js'

const batchUpcomingDays = 5

export default function handler(request: Request, response: Response): void {
  // Batches
  const unfilteredBatches =
    getConfigProperty('settings.includeBatches') && userCanUpdate(request)
      ? getOutstandingBatches()
      : []

  const batchUpcomingDateNumber = dateTimeFunctions.dateToInteger(
    new Date(Date.now() + batchUpcomingDays * 86_400 * 1000)
  )

  const batches = unfilteredBatches.filter((batch) => {
    return batch.batchDate <= batchUpcomingDateNumber
  })

  // Licence Categories
  const licenceCategories = getLicenceCategories()

  response.render('dashboard', {
    headTitle: 'Dashboard',
    batches,
    licenceCategories
  })
}

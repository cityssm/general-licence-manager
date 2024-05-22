import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { RequestHandler } from 'express'

import { getLicenceCategories } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import { getOutstandingBatches } from '../../helpers/licencesDB/getOutstandingBatches.js'

const batchUpcomingDays = 5

export const handler: RequestHandler = (request, response) => {
  // Batches

  const unfilteredBatches =
    configFunctions.getProperty('settings.includeBatches') &&
    request.session.user.userProperties.canUpdate
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

export default handler

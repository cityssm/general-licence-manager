import type { Request, Response } from 'express'

import getLicenceCategories from '../../database/getLicenceCategories.js'
import getLicenceStats from '../../database/getLicenceStats.js'
import { getConfigProperty } from '../../helpers/functions.config.js'

export default function handler(_request: Request, response: Response): void {
  const licenceCategories = getLicenceCategories()

  const licenceStats = getLicenceStats()

  response.render('licence-licenceCategorySummary', {
    headTitle: `${getConfigProperty('settings.licenceAlias')} Category Summary`,
    licenceCategories,
    licenceStats
  })
}

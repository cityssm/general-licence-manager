import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import getLicenceCategories from '../../helpers/licencesDB/getLicenceCategories.js'
import getLicenceStats from '../../helpers/licencesDB/getLicenceStats.js'

export default function handler(_request: Request, response: Response): void {
  const licenceCategories = getLicenceCategories()

  const licenceStats = getLicenceStats()

  response.render('licence-licenceCategorySummary', {
    headTitle: `${configFunctions.getConfigProperty(
      'settings.licenceAlias'
    )} Category Summary`,
    licenceCategories,
    licenceStats
  })
}

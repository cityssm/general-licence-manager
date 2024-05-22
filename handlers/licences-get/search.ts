import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import getLicenceCategories from '../../helpers/licencesDB/getLicenceCategories.js'

export function handler(_request: Request, response: Response): void {
  const licenceCategories = getLicenceCategories()

  response.render('licence-search', {
    headTitle: configFunctions.getProperty('settings.licenceAliasPlural'),
    licenceCategories
  })
}

export default handler

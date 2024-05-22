import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import getLicence from '../../helpers/licencesDB/getLicence.js'
import { getLicenceCategory } from '../../helpers/licencesDB/getLicenceCategory.js'

export function handler(request: Request, response: Response): void {
  const licenceId = Number.parseInt(request.params.licenceId)

  const licence = getLicence(licenceId)

  if (licence === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/licences/?error=licenceIdNotFound'
    )
    return
  }

  const licenceCategory = getLicenceCategory(licence.licenceCategoryKey, {
    includeApprovals: false,
    includeFields: false,
    includeFees: false,
    includeAdditionalFees: false
  })

  response.render('licence-view', {
    headTitle: `${configFunctions.getProperty('settings.licenceAlias')} #${
      licence.licenceNumber
    }`,
    licence,
    licenceCategory
  })
}

export default handler

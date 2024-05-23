import type { Request, Response } from 'express'

import getLicence from '../../database/getLicence.js'
import getLicenceCategory from '../../database/getLicenceCategory.js'
import { getConfigProperty } from '../../helpers/functions.config.js'

export default function handler(request: Request, response: Response): void {
  const licenceId = Number.parseInt(request.params.licenceId)

  const licence = getLicence(licenceId)

  if (licence === undefined) {
    response.redirect(
      `${getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/licences/?error=licenceIdNotFound`
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
    headTitle: `${getConfigProperty('settings.licenceAlias')} #${
      licence.licenceNumber
    }`,
    licence,
    licenceCategory
  })
}

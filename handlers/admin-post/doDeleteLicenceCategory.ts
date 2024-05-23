import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import deleteLicenceCategory from '../../database/deleteLicenceCategory.js'

export default function handler(request: Request, response: Response): void {
  const licenceCategoryKey = request.body.licenceCategoryKey as string

  deleteLicenceCategory(licenceCategoryKey, request.session.user as GLMUser)

  cacheFunctions.clearAll()
  const licenceCategories = cacheFunctions.getLicenceCategories()

  response.json({
    success: true,
    licenceCategories
  })
}

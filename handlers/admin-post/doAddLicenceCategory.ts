import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategory, {
  type AddLicenceCategoryForm
} from '../../helpers/licencesDB/addLicenceCategory.js'

export default function handler(request: Request, response: Response): void {
  const licenceCategoryKey = addLicenceCategory(
    request.body as AddLicenceCategoryForm,
    request.session
  )

  cacheFunctions.clearAll()
  const licenceCategories = cacheFunctions.getLicenceCategories()

  response.json({
    success: true,
    licenceCategories,
    licenceCategoryKey
  })
}

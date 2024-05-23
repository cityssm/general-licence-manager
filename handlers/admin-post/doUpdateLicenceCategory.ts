import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import updateLicenceCategory, {
  type UpdateLicenceCategoryForm
} from '../../database/updateLicenceCategory.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicenceCategory(
    request.body as UpdateLicenceCategoryForm,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()

  response.json({
    success
  })
}

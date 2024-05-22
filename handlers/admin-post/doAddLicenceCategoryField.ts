import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategoryField, {
  type AddLicenceCategoryFieldForm
} from '../../helpers/licencesDB/addLicenceCategoryField.js'
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js'

export default function handler(request: Request, response: Response): void {
  const licenceFieldKey = addLicenceCategoryField(
    request.body as AddLicenceCategoryFieldForm,
    request.session
  )

  cacheFunctions.clearAll()
  const licenceCategoryFields = getLicenceCategoryFields(
    request.body.licenceCategoryKey as string
  )

  response.json({
    success: true,
    licenceCategoryFields,
    licenceFieldKey
  })
}

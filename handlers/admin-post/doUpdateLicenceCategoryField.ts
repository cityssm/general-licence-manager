import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryField from '../../helpers/licencesDB/getLicenceCategoryField.js'
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js'
import updateLicenceCategoryField, {
  type UpdateLicenceCategoryFieldForm
} from '../../helpers/licencesDB/updateLicenceCategoryField.js'
import type { LicenceCategoryField } from '../../types/recordTypes.js'

export function handler(request: Request, response: Response): void {
  const success = updateLicenceCategoryField(
    request.body as UpdateLicenceCategoryFieldForm,
    request.session
  )

  cacheFunctions.clearAll()

  const licenceCategoryField = getLicenceCategoryField(
    request.body.licenceFieldKey as string
  ) as LicenceCategoryField

  const licenceCategoryFields = getLicenceCategoryFields(
    licenceCategoryField.licenceCategoryKey
  )

  response.json({
    success,
    licenceCategoryFields
  })
}

export default handler

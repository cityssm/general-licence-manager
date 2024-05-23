import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryField from '../../database/getLicenceCategoryField.js'
import getLicenceCategoryFields from '../../database/getLicenceCategoryFields.js'
import updateLicenceCategoryField, {
  type UpdateLicenceCategoryFieldForm
} from '../../database/updateLicenceCategoryField.js'
import type { LicenceCategoryField } from '../../types/recordTypes.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicenceCategoryField(
    request.body as UpdateLicenceCategoryFieldForm,
    request.session.user as GLMUser
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

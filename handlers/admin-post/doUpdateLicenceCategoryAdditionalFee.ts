import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryAdditionalFee from '../../database/getLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js'
import updateLicenceCategoryAdditionalFee, {
  type UpdateLicenceCategoryAdditionalFeeForm
} from '../../database/updateLicenceCategoryAdditionalFee.js'
import type { LicenceCategoryAdditionalFee } from '../../types/recordTypes.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicenceCategoryAdditionalFee(
    request.body as UpdateLicenceCategoryAdditionalFeeForm,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()

  const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(
    request.body.licenceAdditionalFeeKey as string
  ) as LicenceCategoryAdditionalFee

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(
    licenceCategoryAdditionalFee.licenceCategoryKey
  )

  response.json({
    success,
    licenceCategoryAdditionalFees
  })
}

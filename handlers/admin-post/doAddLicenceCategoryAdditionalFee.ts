import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategoryAdditionalFee, {
  type AddLicenceCategoryAdditionalFeeForm
} from '../../helpers/licencesDB/addLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceAdditionalFeeKey = addLicenceCategoryAdditionalFee(
    request.body as AddLicenceCategoryAdditionalFeeForm,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(
    request.body.licenceCategoryKey as string
  )

  response.json({
    success: true,
    licenceCategoryAdditionalFees,
    licenceAdditionalFeeKey
  })
}

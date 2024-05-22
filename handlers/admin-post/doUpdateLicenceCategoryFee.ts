import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryFee from '../../helpers/licencesDB/getLicenceCategoryFee.js'
import getLicenceCategoryFees from '../../helpers/licencesDB/getLicenceCategoryFees.js'
import updateLicenceCategoryFee, {
  type UpdateLicenceCategoryFeeForm
} from '../../helpers/licencesDB/updateLicenceCategoryFee.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicenceCategoryFee(
    request.body as UpdateLicenceCategoryFeeForm,
    request.session
  )

  cacheFunctions.clearAll()

  const licenceCategoryFee = getLicenceCategoryFee(
    request.body.licenceFeeId as string
  )

  const licenceCategoryFees = getLicenceCategoryFees(
    licenceCategoryFee?.licenceCategoryKey ?? '',
    'all'
  )

  response.json({
    success,
    licenceCategoryFees
  })
}

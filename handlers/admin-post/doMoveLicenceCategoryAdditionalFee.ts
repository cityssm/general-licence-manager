import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js'
import moveLicenceCategoryAdditionalFee from '../../database/moveLicenceCategoryAdditionalFee.js'

export default function handler(request: Request, response: Response): void {
  const licenceAdditionalFeeKeyFrom = request.body
    .licenceAdditionalFeeKey_from as string

  const licenceAdditionalFeeKeyTo = request.body
    .licenceAdditionalFeeKey_to as string

  const licenceCategoryKey = moveLicenceCategoryAdditionalFee(
    licenceAdditionalFeeKeyFrom,
    licenceAdditionalFeeKeyTo,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()
  const licenceCategoryAdditionalFees =
    getLicenceCategoryAdditionalFees(licenceCategoryKey)

  response.json({
    licenceCategoryAdditionalFees
  })
}

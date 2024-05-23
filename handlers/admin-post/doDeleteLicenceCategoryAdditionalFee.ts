import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import deleteLicenceCategoryAdditionalFee from '../../database/deleteLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFee from '../../database/getLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFees from '../../database/getLicenceCategoryAdditionalFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceAdditionalFeeKey = request.body.licenceAdditionalFeeKey as string

  const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(
    licenceAdditionalFeeKey
  )

  if (licenceCategoryAdditionalFee === undefined) {
    response.json({
      success: false
    })
  } else {
    deleteLicenceCategoryAdditionalFee(
      licenceAdditionalFeeKey,
      request.session.user as GLMUser
    )

    cacheFunctions.clearAll()

    const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(
      licenceCategoryAdditionalFee.licenceCategoryKey
    )

    response.json({
      success: true,
      licenceCategoryAdditionalFees
    })
  }
}

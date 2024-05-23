import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import deleteLicenceCategoryFee from '../../database/deleteLicenceCategoryFee.js'
import getLicenceCategoryFee from '../../database/getLicenceCategoryFee.js'
import getLicenceCategoryFees from '../../database/getLicenceCategoryFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceFeeId = request.body.licenceFeeId as string

  const licenceCategoryFee = getLicenceCategoryFee(licenceFeeId)

  if (licenceCategoryFee === undefined) {
    response.json({
      success: false
    })
  } else {
    deleteLicenceCategoryFee(licenceFeeId, request.session.user as GLMUser)

    cacheFunctions.clearAll()
    const licenceCategoryFees = getLicenceCategoryFees(
      licenceCategoryFee.licenceCategoryKey,
      'all'
    )

    response.json({
      success: true,
      licenceCategoryFees
    })
  }
}

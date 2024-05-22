import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import deleteLicenceCategoryFee from '../../helpers/licencesDB/deleteLicenceCategoryFee.js'
import getLicenceCategoryFee from '../../helpers/licencesDB/getLicenceCategoryFee.js'
import getLicenceCategoryFees from '../../helpers/licencesDB/getLicenceCategoryFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceFeeId = request.body.licenceFeeId as string

  const licenceCategoryFee = getLicenceCategoryFee(licenceFeeId)

  if (licenceCategoryFee === undefined) {
    response.json({
      success: false
    })
  } else {
    deleteLicenceCategoryFee(licenceFeeId, request.session)

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

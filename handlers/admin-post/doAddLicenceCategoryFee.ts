import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategoryFee from '../../database/addLicenceCategoryFee.js'
import getLicenceCategoryFees from '../../database/getLicenceCategoryFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceFeeId = addLicenceCategoryFee(
    request.body.licenceCategoryKey as string,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()
  const licenceCategoryFees = getLicenceCategoryFees(
    request.body.licenceCategoryKey as string,
    'all'
  )

  response.json({
    success: true,
    licenceCategoryFees,
    licenceFeeId
  })
}

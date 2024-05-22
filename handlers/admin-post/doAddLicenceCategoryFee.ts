import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategoryFee from '../../helpers/licencesDB/addLicenceCategoryFee.js'
import getLicenceCategoryFees from '../../helpers/licencesDB/getLicenceCategoryFees.js'

export default function handler(request: Request, response: Response): void {
  const licenceFeeId = addLicenceCategoryFee(
    request.body.licenceCategoryKey as string,
    request.session
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

import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import deleteLicenceCategoryApproval from '../../database/deleteLicenceCategoryApproval.js'
import getLicenceCategoryApproval from '../../database/getLicenceCategoryApproval.js'
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js'

export default function handler(request: Request, response: Response): void {
  const licenceApprovalKey = request.body.licenceApprovalKey as string

  const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey)

  if (licenceCategoryApproval === undefined) {
    response.json({
      success: false
    })
  } else {
    deleteLicenceCategoryApproval(
      licenceApprovalKey,
      request.session.user as GLMUser
    )

    cacheFunctions.clearAll()
    const licenceCategoryApprovals = getLicenceCategoryApprovals(
      licenceCategoryApproval.licenceCategoryKey
    )

    response.json({
      success: true,
      licenceCategoryApprovals
    })
  }
}

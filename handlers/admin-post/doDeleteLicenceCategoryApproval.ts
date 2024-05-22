import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import { deleteLicenceCategoryApproval } from '../../helpers/licencesDB/deleteLicenceCategoryApproval.js'
import getLicenceCategoryApproval from '../../helpers/licencesDB/getLicenceCategoryApproval.js'
import { getLicenceCategoryApprovals } from '../../helpers/licencesDB/getLicenceCategoryApprovals.js'

export function handler(request: Request, response: Response): void {
  const licenceApprovalKey = request.body.licenceApprovalKey as string

  const licenceCategoryApproval = getLicenceCategoryApproval(licenceApprovalKey)

  if (licenceCategoryApproval === undefined) {
    response.json({
      success: false
    })
  } else {
    deleteLicenceCategoryApproval(licenceApprovalKey, request.session)

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

export default handler

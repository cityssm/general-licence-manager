import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryApprovals from '../../helpers/licencesDB/getLicenceCategoryApprovals.js'
import moveLicenceCategoryApproval from '../../helpers/licencesDB/moveLicenceCategoryApproval.js'

export default function handler(request: Request, response: Response): void {
  const licenceApprovalKeyFrom = request.body.licenceApprovalKey_from as string
  const licenceApprovalKeyTo = request.body.licenceApprovalKey_to as string

  const licenceCategoryKey = moveLicenceCategoryApproval(
    licenceApprovalKeyFrom,
    licenceApprovalKeyTo,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()
  const licenceCategoryApprovals =
    getLicenceCategoryApprovals(licenceCategoryKey)

  response.json({
    licenceCategoryApprovals
  })
}

import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryApproval from '../../database/getLicenceCategoryApproval.js'
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js'
import updateLicenceCategoryApproval, {
  type UpdateLicenceCategoryApprovalForm
} from '../../database/updateLicenceCategoryApproval.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicenceCategoryApproval(
    request.body as UpdateLicenceCategoryApprovalForm,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()

  const licenceCategoryApproval = getLicenceCategoryApproval(
    request.body.licenceApprovalKey as string
  )

  const licenceCategoryApprovals = getLicenceCategoryApprovals(
    licenceCategoryApproval.licenceCategoryKey
  )

  response.json({
    success,
    licenceCategoryApprovals
  })
}

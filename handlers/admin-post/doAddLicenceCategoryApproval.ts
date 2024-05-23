import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import addLicenceCategoryApproval, {
  type AddLicenceCategoryApprovalForm
} from '../../database/addLicenceCategoryApproval.js'
import getLicenceCategoryApprovals from '../../database/getLicenceCategoryApprovals.js'

export default function handler(request: Request, response: Response): void {
  const licenceApprovalKey = addLicenceCategoryApproval(
    request.body as AddLicenceCategoryApprovalForm,
    request.session.user as GLMUser
  )

  cacheFunctions.clearAll()

  const licenceCategoryApprovals = getLicenceCategoryApprovals(
    request.body.licenceCategoryKey as string
  )

  response.json({
    success: true,
    licenceCategoryApprovals,
    licenceApprovalKey
  })
}

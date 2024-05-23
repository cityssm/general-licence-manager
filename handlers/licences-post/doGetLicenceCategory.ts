import type { Request, Response } from 'express'

import getLicenceCategory from '../../database/getLicenceCategory.js'

export default function handler(request: Request, response: Response): void {
  const licenceCategory = getLicenceCategory(
    request.body.licenceCategoryKey as string,
    {
      includeApprovals: true,
      includeFees: 'current',
      includeFields: true,
      includeAdditionalFees: true
    }
  )

  response.json({
    success: true,
    licenceCategory
  })
}

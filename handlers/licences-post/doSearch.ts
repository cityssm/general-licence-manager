import type { Request, Response } from 'express'

import getLicences from '../../database/getLicences.js'

export default function handler(request: Request, response: Response): void {
  const licencesResponse = getLicences(
    {
      licenceCategoryKey: request.body.licenceCategoryKey,
      licenceDetails: request.body.licenceDetails,
      licensee: request.body.licensee,
      licenceStatus: request.body.licenceStatus
    },
    {
      limit: Number.parseInt((request.body.limit ?? '-1') as string),
      offset: Number.parseInt((request.body.offset ?? '0') as string),
      includeFields: true
    }
  )

  response.json(licencesResponse)
}

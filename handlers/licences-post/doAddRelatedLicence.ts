import type { Request, Response } from 'express'

import addRelatedLicence from '../../database/addRelatedLicence.js'
import getLicences from '../../database/getLicences.js'

export default function handler(request: Request, response: Response): void {
  const success = addRelatedLicence(
    request.body.licenceId as string,
    request.body.relatedLicenceId as string
  )

  const relatedLicences = getLicences(
    {
      relatedLicenceId: request.body.licenceId
    },
    {
      limit: -1,
      offset: 0
    }
  ).licences

  response.json({
    success,
    relatedLicences
  })
}

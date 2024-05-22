import type { Request, Response } from 'express'

import deleteRelatedLicence from '../../helpers/licencesDB/deleteRelatedLicence.js'
import getLicences from '../../helpers/licencesDB/getLicences.js'

export default function handler(request: Request, response: Response): void {
  const success = deleteRelatedLicence(
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

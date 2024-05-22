import type { Request, Response } from 'express'

import { addRelatedLicence } from '../../helpers/licencesDB/addRelatedLicence.js'
import getLicences from '../../helpers/licencesDB/getLicences.js'

export async function handler(request: Request, response: Response): Promise<void> {
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

export default handler

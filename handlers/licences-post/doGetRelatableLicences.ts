import type { Request, Response } from 'express'

import getLicences from '../../helpers/licencesDB/getLicences.js'

export default function handler(request: Request, response: Response): void {
  const licences = getLicences(
    {
      notRelatedLicenceId: request.body.licenceId,
      searchString: request.body.searchString
    },
    {
      limit: 10,
      offset: 0
    }
  ).licences

  response.json({
    licences
  })
}

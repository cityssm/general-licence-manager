import type { Request, Response } from 'express'

import issueLicence from '../../helpers/licencesDB/issueLicence.js'

export default function handler(request: Request, response: Response): void {
  const success = issueLicence(
    request.body.licenceId as string,
    request.session
  )

  response.json({
    success
  })
}

import type { Request, Response } from 'express'

import deleteLicence from '../../helpers/licencesDB/deleteLicence.js'

export default function handler(request: Request, response: Response): void {
  const success = deleteLicence(
    request.body.licenceId as string,
    request.session
  )

  response.json({
    success
  })
}

import type { Request, Response } from 'express'

import deleteLicence from '../../database/deleteLicence.js'

export default function handler(request: Request, response: Response): void {
  const success = deleteLicence(
    request.body.licenceId as string,
    request.session.user as GLMUser
  )

  response.json({
    success
  })
}

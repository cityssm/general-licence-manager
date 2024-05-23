import type { Request, Response } from 'express'

import updateLicence, {
  type UpdateLicenceForm
} from '../../database/updateLicence.js'

export default function handler(request: Request, response: Response): void {
  const success = updateLicence(
    request.body as UpdateLicenceForm,
    request.session.user as GLMUser
  )

  response.json({
    success,
    licenceId: request.body.licenceId
  })
}

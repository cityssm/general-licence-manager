import type { Request, Response } from 'express'

import createLicence, {
  type CreateLicenceForm
} from '../../helpers/licencesDB/createLicence.js'

export default function handler(request: Request, response: Response): void {
  const licenceId = createLicence(
    request.body as CreateLicenceForm,
    request.session
  )

  response.json({
    success: true,
    licenceId
  })
}

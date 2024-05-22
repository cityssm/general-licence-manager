import type { Request, Response } from 'express'

import refreshDatabase from '../../helpers/licencesDB/refreshDatabase.js'

export default function handler(request: Request, response: Response): void {
  const success = refreshDatabase(request.session)

  response.json({
    success
  })
}

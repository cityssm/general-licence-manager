import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'

export default function handler(_request: Request, response: Response): void {
  cacheFunctions.clearAll()
  const licenceCategories = cacheFunctions.getLicenceCategories()

  response.json({
    licenceCategories
  })
}

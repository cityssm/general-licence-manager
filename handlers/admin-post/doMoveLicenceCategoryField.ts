import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import getLicenceCategoryFields from '../../helpers/licencesDB/getLicenceCategoryFields.js'
import { moveLicenceCategoryField } from '../../helpers/licencesDB/moveLicenceCategoryField.js'

export function handler(request: Request, response: Response): void {
  const licenceFieldKeyFrom = request.body.licenceFieldKey_from as string
  const licenceFieldKeyTo = request.body.licenceFieldKey_to as string

  const licenceCategoryKey = moveLicenceCategoryField(
    licenceFieldKeyFrom,
    licenceFieldKeyTo,
    request.session
  )

  cacheFunctions.clearAll()
  const licenceCategoryFields = getLicenceCategoryFields(licenceCategoryKey)

  response.json({
    licenceCategoryFields
  })
}

export default handler

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { Request, Response } from 'express'

import getLicences from '../../helpers/licencesDB/getLicences.js'

export default function handler(request: Request, response: Response): void {
  const licencesResponse = getLicences(
    {
      licenceCategoryKey: request.body.licenceCategoryKey,
      startDateMin: dateTimeFunctions.dateStringToInteger(
        request.body.startDateStringMin as string
      ),
      startDateMax: dateTimeFunctions.dateStringToInteger(
        request.body.startDateStringMax as string
      )
    },
    {
      limit: -1,
      offset: 0,
      includeFields: true,
      includeTransactions: true
    }
  )

  response.json(licencesResponse)
}

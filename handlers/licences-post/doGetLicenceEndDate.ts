import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { Request, Response } from 'express'

import { getLicenceLengthFunction } from '../../helpers/functions.config.js'

export default function handler(request: Request, response: Response): void {
  const licenceLengthFunctionName = request.body.licenceLengthFunction as string

  const licenceLengthFunction = getLicenceLengthFunction(
    licenceLengthFunctionName
  )

  if (licenceLengthFunction === undefined) {
    response.json({
      success: false,
      errorMessage: `Unable to find licence length function: ${licenceLengthFunctionName}`
    })
    return
  }

  const startDateString = request.body.startDateString as string
  const startDate = dateTimeFunctions.dateStringToDate(startDateString)

  const endDate = licenceLengthFunction(startDate)

  response.json({
    success: true,
    endDateString: dateTimeFunctions.dateToString(endDate)
  })
}

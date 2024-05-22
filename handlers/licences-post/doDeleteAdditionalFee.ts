import type { Request, Response } from 'express'

import deleteLicenceAdditionalFee from '../../helpers/licencesDB/deleteLicenceAdditionalFee.js'

export default function handler(request: Request, response: Response): void {
  const feeDetails = deleteLicenceAdditionalFee(
    request.body.licenceId as string,
    request.body.licenceAdditionalFeeKey as string,
    request.session
  )

  response.json({
    success: true,
    licenceFee: feeDetails.licenceFee
  })
}

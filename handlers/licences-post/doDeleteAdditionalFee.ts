import type { Request, Response } from 'express'

import deleteLicenceAdditionalFee from '../../database/deleteLicenceAdditionalFee.js'

export default function handler(request: Request, response: Response): void {
  const feeDetails = deleteLicenceAdditionalFee(
    request.body.licenceId as string,
    request.body.licenceAdditionalFeeKey as string,
    request.session.user as GLMUser
  )

  response.json({
    success: true,
    licenceFee: feeDetails.licenceFee
  })
}

import type { Request, Response } from 'express'

import addLicenceAdditionalFee from '../../database/addLicenceAdditionalFee.js'
import type { LicenceAdditionalFee } from '../../types/recordTypes.js'

export default function handler(request: Request, response: Response): void {
  const feeDetails = addLicenceAdditionalFee(
    request.body.licenceId as string,
    request.body.licenceAdditionalFeeKey as string,
    request.session.user as GLMUser
  )

  const additionalFee: LicenceAdditionalFee = {
    licenceAdditionalFeeKey:
      feeDetails.licenceCategoryAdditionalFee.licenceAdditionalFeeKey,
    additionalFeeAmount: feeDetails.additionalFeeAmount,
    additionalFee: feeDetails.licenceCategoryAdditionalFee.additionalFee
  }

  response.json({
    success: true,
    licenceFee: feeDetails.licenceFee,
    additionalFee
  })
}

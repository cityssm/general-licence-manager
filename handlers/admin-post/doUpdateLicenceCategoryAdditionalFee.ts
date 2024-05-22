import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import { getLicenceCategoryAdditionalFee } from '../../helpers/licencesDB/getLicenceCategoryAdditionalFee.js'
import getLicenceCategoryAdditionalFees from '../../helpers/licencesDB/getLicenceCategoryAdditionalFees.js'
import updateLicenceCategoryAdditionalFee, {
  type UpdateLicenceCategoryAdditionalFeeForm
} from '../../helpers/licencesDB/updateLicenceCategoryAdditionalFee.js'
import type { LicenceCategoryAdditionalFee } from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = updateLicenceCategoryAdditionalFee(
    request.body as UpdateLicenceCategoryAdditionalFeeForm,
    request.session
  )

  cacheFunctions.clearAll()

  const licenceCategoryAdditionalFee = getLicenceCategoryAdditionalFee(
    request.body.licenceAdditionalFeeKey as string
  ) as LicenceCategoryAdditionalFee

  const licenceCategoryAdditionalFees = getLicenceCategoryAdditionalFees(
    licenceCategoryAdditionalFee.licenceCategoryKey
  )

  response.json({
    success,
    licenceCategoryAdditionalFees
  })
}

export default handler

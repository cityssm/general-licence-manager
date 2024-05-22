import type { LicenceCategoryAdditionalFee } from '../types/recordTypes.js'

import * as configFunctions from './functions.config.js'

export function calculateAdditionalFeeAmount(
  licenceCategoryAdditionalFee: LicenceCategoryAdditionalFee,
  baseLicenceFee: number | string
): number {
  const baseLicenceFeeFloat =
    typeof baseLicenceFee === 'string'
      ? Number.parseFloat(baseLicenceFee)
      : baseLicenceFee

  let additionalFeeAmount =
    licenceCategoryAdditionalFee.additionalFeeNumber ?? 0

  switch (licenceCategoryAdditionalFee.additionalFeeType) {
    case 'percent': {
      additionalFeeAmount = baseLicenceFeeFloat * (additionalFeeAmount / 100)
      break
    }

    case 'function': {
      additionalFeeAmount = configFunctions.getAdditionalFeeFunction(
        licenceCategoryAdditionalFee.additionalFeeFunction ?? ''
      )(baseLicenceFeeFloat)

      break
    }
  }

  return additionalFeeAmount
}

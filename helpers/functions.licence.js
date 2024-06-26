import { getAdditionalFeeFunction } from './functions.config.js';
export function calculateAdditionalFeeAmount(licenceCategoryAdditionalFee, baseLicenceFee) {
    const baseLicenceFeeFloat = typeof baseLicenceFee === 'string'
        ? Number.parseFloat(baseLicenceFee)
        : baseLicenceFee;
    let additionalFeeAmount = licenceCategoryAdditionalFee.additionalFeeNumber ?? 0;
    switch (licenceCategoryAdditionalFee.additionalFeeType) {
        case 'percent': {
            additionalFeeAmount = baseLicenceFeeFloat * (additionalFeeAmount / 100);
            break;
        }
        case 'function': {
            additionalFeeAmount = getAdditionalFeeFunction(licenceCategoryAdditionalFee.additionalFeeFunction ?? '')(baseLicenceFeeFloat);
            break;
        }
    }
    return additionalFeeAmount;
}

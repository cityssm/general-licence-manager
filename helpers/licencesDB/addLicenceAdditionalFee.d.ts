import type { LicenceCategoryAdditionalFee, PartialSession } from '../../types/recordTypes.js';
interface AddLicenceAdditionalFeeReturn {
    licenceFee: number;
    additionalFeeAmount: number;
    licenceCategoryAdditionalFee: LicenceCategoryAdditionalFee;
}
export default function addLicenceAdditionalFee(licenceId: string | number, licenceAdditionalFeeKey: string, requestSession: PartialSession): AddLicenceAdditionalFeeReturn;
export {};

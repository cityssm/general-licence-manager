import type { PartialSession } from '../../types/recordTypes.js';
interface DeleteLicenceAdditionalFeeReturn {
    licenceFee: number;
}
export default function deleteLicenceAdditionalFee(licenceId: string | number, licenceAdditionalFeeKey: string, requestSession: PartialSession): DeleteLicenceAdditionalFeeReturn;
export {};

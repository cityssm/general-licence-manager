import type * as recordTypes from '../../types/recordTypes';
interface AddLicenceAdditionalFeeReturn {
    licenceFee: number;
    additionalFeeAmount: number;
    licenceCategoryAdditionalFee: recordTypes.LicenceCategoryAdditionalFee;
}
export declare const addLicenceAdditionalFee: (licenceId: string | number, licenceAdditionalFeeKey: string, requestSession: recordTypes.PartialSession) => AddLicenceAdditionalFeeReturn;
export default addLicenceAdditionalFee;

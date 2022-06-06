import type * as recordTypes from "../../types/recordTypes";
interface DeleteLicenceAdditionalFeeReturn {
    licenceFee: number;
}
export declare const deleteLicenceAdditionalFee: (licenceId: string | number, licenceAdditionalFeeKey: string, requestSession: recordTypes.PartialSession) => DeleteLicenceAdditionalFeeReturn;
export default deleteLicenceAdditionalFee;

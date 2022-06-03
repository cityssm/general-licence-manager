import type * as recordTypes from "../../types/recordTypes";
export declare const addLicenceAdditionalFee: (licenceId: string | number, licenceAdditionalFeeKey: string, requestSession: recordTypes.PartialSession) => {
    licenceFee: number;
    additionalFeeAmount: number;
    licenceCategoryAdditionalFee: recordTypes.LicenceCategoryAdditionalFee;
};
export default addLicenceAdditionalFee;

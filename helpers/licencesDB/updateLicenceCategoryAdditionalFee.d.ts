import type * as recordTypes from "../../types/recordTypes";
interface UpdateLicenceCategoryAdditionalFeeForm {
    licenceAdditionalFeeKey: string;
    additionalFee: string;
    additionalFeeType: string;
    additionalFeeNumber: string;
    additionalFeeFunction?: string;
    isRequired?: string;
}
export declare const updateLicenceCategoryAdditionalFee: (licenceCategoryAdditionalFeeForm: UpdateLicenceCategoryAdditionalFeeForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLicenceCategoryAdditionalFee;

import type * as recordTypes from "../../types/recordTypes";
interface AddLicenceCategoryAdditionalFeeForm {
    licenceCategoryKey: string;
    additionalFee: string;
}
export declare const addLicenceCategoryAdditionalFee: (licenceCategoryAdditionalFeeForm: AddLicenceCategoryAdditionalFeeForm, requestSession: recordTypes.PartialSession) => string;
export default addLicenceCategoryAdditionalFee;

import type * as recordTypes from "../../types/recordTypes";
interface UpdateLicenceCategoryFeeForm {
    licenceFeeId: number | string;
    effectiveStartDateString: string;
    effectiveEndDateString: string;
    licenceFee: number | string;
    renewalFee: number | string;
    replacementFee: number | string;
}
export declare const updateLicenceCategoryFee: (licenceCategoryFeeForm: UpdateLicenceCategoryFeeForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLicenceCategoryFee;

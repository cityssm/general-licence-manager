import type * as expressSession from "express-session";
interface UpdateLicenceCategoryFeeForm {
    licenceFeeId: string;
    effectiveStartDateString: string;
    effectiveEndDateString: string;
    licenceFee: string;
    renewalFee: string;
    replacementFee: string;
}
export declare const updateLicenceCategoryFee: (licenceCategoryFeeForm: UpdateLicenceCategoryFeeForm, requestSession: expressSession.Session) => boolean;
export default updateLicenceCategoryFee;

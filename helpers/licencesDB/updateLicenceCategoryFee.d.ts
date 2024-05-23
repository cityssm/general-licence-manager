export interface UpdateLicenceCategoryFeeForm {
    licenceFeeId: number | string;
    effectiveStartDateString: string;
    effectiveEndDateString: string;
    licenceFee: number | string;
    renewalFee: number | string;
    replacementFee: number | string;
}
export default function updateLicenceCategoryFee(licenceCategoryFeeForm: UpdateLicenceCategoryFeeForm, sessionUser: GLMUser): boolean;

export interface UpdateLicenceCategoryAdditionalFeeForm {
    licenceAdditionalFeeKey: string;
    additionalFee: string;
    additionalFeeType: string;
    additionalFeeNumber: string;
    additionalFeeFunction?: string;
    isRequired?: string;
}
export default function updateLicenceCategoryAdditionalFee(licenceCategoryAdditionalFeeForm: UpdateLicenceCategoryAdditionalFeeForm, sessionUser: GLMUser): boolean;

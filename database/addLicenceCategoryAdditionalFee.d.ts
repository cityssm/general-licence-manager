export interface AddLicenceCategoryAdditionalFeeForm {
    licenceCategoryKey: string;
    additionalFee: string;
}
export default function addLicenceCategoryAdditionalFee(licenceCategoryAdditionalFeeForm: AddLicenceCategoryAdditionalFeeForm, sessionUser: GLMUser): string;

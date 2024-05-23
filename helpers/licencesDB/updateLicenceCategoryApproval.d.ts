export interface UpdateLicenceCategoryApprovalForm {
    licenceApprovalKey: string;
    licenceApproval: string;
    licenceApprovalDescription: string;
    isRequiredForNew?: string;
    isRequiredForRenewal?: string;
    printKey: string;
}
export default function updateLicenceCategoryApproval(licenceCategoryApprovalForm: UpdateLicenceCategoryApprovalForm, sessionUser: GLMUser): boolean;

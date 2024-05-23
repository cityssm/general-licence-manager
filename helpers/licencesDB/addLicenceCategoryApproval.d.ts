export interface AddLicenceCategoryApprovalForm {
    licenceCategoryKey: string;
    licenceApproval: string;
}
export default function addLicenceCategoryApproval(licenceCategoryApprovalForm: AddLicenceCategoryApprovalForm, sessionUser: GLMUser): string;

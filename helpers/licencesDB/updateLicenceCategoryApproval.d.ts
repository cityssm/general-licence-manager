import type { PartialSession } from '../../types/recordTypes.js';
export interface UpdateLicenceCategoryApprovalForm {
    licenceApprovalKey: string;
    licenceApproval: string;
    licenceApprovalDescription: string;
    isRequiredForNew?: string;
    isRequiredForRenewal?: string;
    printKey: string;
}
export default function updateLicenceCategoryApproval(licenceCategoryApprovalForm: UpdateLicenceCategoryApprovalForm, requestSession: PartialSession): boolean;

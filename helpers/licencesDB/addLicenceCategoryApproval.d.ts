import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceCategoryApprovalForm {
    licenceCategoryKey: string;
    licenceApproval: string;
}
export default function addLicenceCategoryApproval(licenceCategoryApprovalForm: AddLicenceCategoryApprovalForm, requestSession: PartialSession): string;

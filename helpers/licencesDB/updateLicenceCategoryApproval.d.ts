import type * as recordTypes from "../../types/recordTypes";
interface UpdateLicenceCategoryApprovalForm {
    licenceApprovalKey: string;
    licenceApproval: string;
    licenceApprovalDescription: string;
    isRequiredForNew?: string;
    isRequiredForRenewal?: string;
    printKey: string;
}
export declare const updateLicenceCategoryApproval: (licenceCategoryApprovalForm: UpdateLicenceCategoryApprovalForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLicenceCategoryApproval;

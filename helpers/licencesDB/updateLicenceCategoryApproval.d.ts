import type * as expressSession from "express-session";
interface UpdateLicenceCategoryApprovalForm {
    licenceApprovalKey: string;
    licenceApproval: string;
    licenceApprovalDescription: string;
    isRequiredForNew?: string;
    isRequiredForRenewal?: string;
}
export declare const updateLicenceCategoryApproval: (licenceCategoryApprovalForm: UpdateLicenceCategoryApprovalForm, requestSession: expressSession.Session) => boolean;
export default updateLicenceCategoryApproval;

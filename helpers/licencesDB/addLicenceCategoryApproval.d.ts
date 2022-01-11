import type * as expressSession from "express-session";
interface AddLicenceCategoryApprovalForm {
    licenceCategoryKey: string;
    licenceApproval: string;
}
export declare const addLicenceCategoryApproval: (licenceCategoryApprovalForm: AddLicenceCategoryApprovalForm, requestSession: expressSession.Session) => string;
export default addLicenceCategoryApproval;

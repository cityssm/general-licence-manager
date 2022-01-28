import type * as recordTypes from "../../types/recordTypes";
interface AddLicenceCategoryApprovalForm {
    licenceCategoryKey: string;
    licenceApproval: string;
}
export declare const addLicenceCategoryApproval: (licenceCategoryApprovalForm: AddLicenceCategoryApprovalForm, requestSession: recordTypes.PartialSession) => string;
export default addLicenceCategoryApproval;

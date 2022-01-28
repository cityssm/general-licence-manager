import type * as recordTypes from "../../types/recordTypes";
interface AddLicenceCategoryForm {
    licenceCategoryKey?: string;
    licenceCategory: string;
}
export declare const addLicenceCategory: (licenceCategoryForm: AddLicenceCategoryForm, requestSession: recordTypes.PartialSession) => string;
export default addLicenceCategory;

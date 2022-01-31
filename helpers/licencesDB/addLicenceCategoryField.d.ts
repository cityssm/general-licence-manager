import type * as recordTypes from "../../types/recordTypes";
interface AddLicenceCategoryFieldForm {
    licenceCategoryKey: string;
    licenceField: string;
}
export declare const addLicenceCategoryField: (licenceCategoryFieldForm: AddLicenceCategoryFieldForm, requestSession: recordTypes.PartialSession) => string;
export default addLicenceCategoryField;

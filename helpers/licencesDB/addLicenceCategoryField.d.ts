import type * as expressSession from "express-session";
interface AddLicenceCategoryFieldForm {
    licenceCategoryKey: string;
    licenceField: string;
}
export declare const addLicenceCategoryField: (licenceCategoryFieldForm: AddLicenceCategoryFieldForm, requestSession: expressSession.Session) => string;
export default addLicenceCategoryField;

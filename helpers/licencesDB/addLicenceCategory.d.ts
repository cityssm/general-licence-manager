import type * as expressSession from "express-session";
interface AddLicenceCategoryForm {
    licenceCategory: string;
}
export declare const addLicenceCategory: (licenceCategoryForm: AddLicenceCategoryForm, requestSession: expressSession.Session) => string;
export default addLicenceCategory;

import type * as expressSession from "express-session";
interface UpdateLicenceCategoryFieldForm {
    licenceFieldKey: string;
    licenceField: string;
    licenceFieldDescription: string;
    isRequired?: string;
    minimumLength: string;
    maximumLength: string;
    pattern: string;
    printKey: string;
}
export declare const updateLicenceCategoryField: (licenceCategoryFieldForm: UpdateLicenceCategoryFieldForm, requestSession: expressSession.Session) => boolean;
export default updateLicenceCategoryField;

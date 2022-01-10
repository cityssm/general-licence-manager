import type * as expressSession from "express-session";
interface UpdateLicenceCategoryForm {
    licenceCategoryKey: string;
    licenceCategory: string;
    bylawNumber: string;
    printEJS: string;
    licenceLengthYears: string;
    licenceLengthMonths: string;
    licenceLengthDays: string;
}
export declare const updateLicenceCategory: (licenceCategoryForm: UpdateLicenceCategoryForm, requestSession: expressSession.Session) => boolean;
export default updateLicenceCategory;

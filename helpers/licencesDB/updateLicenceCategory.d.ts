import type * as recordTypes from "../../types/recordTypes";
interface UpdateLicenceCategoryForm {
    licenceCategoryKey: string;
    licenceCategory: string;
    bylawNumber: string;
    printEJS: string;
    licenceLengthFunction: string;
    licenceLengthYears: string;
    licenceLengthMonths: string;
    licenceLengthDays: string;
}
export declare const updateLicenceCategory: (licenceCategoryForm: UpdateLicenceCategoryForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLicenceCategory;

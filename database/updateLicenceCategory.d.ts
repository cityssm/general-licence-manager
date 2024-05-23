export interface UpdateLicenceCategoryForm {
    licenceCategoryKey: string;
    licenceCategory: string;
    bylawNumber: string;
    printEJS: string;
    licenceLengthFunction: string;
    licenceLengthYears: string;
    licenceLengthMonths: string;
    licenceLengthDays: string;
}
export default function updateLicenceCategory(licenceCategoryForm: UpdateLicenceCategoryForm, sessionUser: GLMUser): boolean;

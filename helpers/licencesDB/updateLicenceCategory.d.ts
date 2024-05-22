import type { PartialSession } from '../../types/recordTypes.js';
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
export default function updateLicenceCategory(licenceCategoryForm: UpdateLicenceCategoryForm, requestSession: PartialSession): boolean;

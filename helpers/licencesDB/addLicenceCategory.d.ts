import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceCategoryForm {
    licenceCategoryKey?: string;
    licenceCategory: string;
}
export default function addLicenceCategory(licenceCategoryForm: AddLicenceCategoryForm, requestSession: PartialSession): string;

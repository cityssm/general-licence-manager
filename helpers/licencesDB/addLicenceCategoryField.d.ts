import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceCategoryFieldForm {
    licenceCategoryKey: string;
    licenceField: string;
}
export default function addLicenceCategoryField(licenceCategoryFieldForm: AddLicenceCategoryFieldForm, requestSession: PartialSession): string;

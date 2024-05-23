export interface UpdateLicenceCategoryFieldForm {
    licenceFieldKey: string;
    licenceField: string;
    licenceFieldDescription: string;
    isRequired?: string;
    minimumLength: string;
    maximumLength: string;
    pattern: string;
    printKey: string;
}
export default function updateLicenceCategoryField(licenceCategoryFieldForm: UpdateLicenceCategoryFieldForm, sessionUser: GLMUser): boolean;

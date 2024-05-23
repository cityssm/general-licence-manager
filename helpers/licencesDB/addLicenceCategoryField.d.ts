export interface AddLicenceCategoryFieldForm {
    licenceCategoryKey: string;
    licenceField: string;
}
export default function addLicenceCategoryField(licenceCategoryFieldForm: AddLicenceCategoryFieldForm, sessionUser: GLMUser): string;

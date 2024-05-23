export interface AddLicenceCategoryForm {
    licenceCategoryKey?: string;
    licenceCategory: string;
}
export default function addLicenceCategory(licenceCategoryForm: AddLicenceCategoryForm, sessionUser: GLMUser): string;

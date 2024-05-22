import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceCategoryAdditionalFeeForm {
    licenceCategoryKey: string;
    additionalFee: string;
}
export declare function addLicenceCategoryAdditionalFee(licenceCategoryAdditionalFeeForm: AddLicenceCategoryAdditionalFeeForm, requestSession: PartialSession): string;
export default addLicenceCategoryAdditionalFee;

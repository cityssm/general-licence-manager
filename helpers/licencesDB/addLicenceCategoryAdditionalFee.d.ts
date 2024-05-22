import type { PartialSession } from '../../types/recordTypes.js';
export interface AddLicenceCategoryAdditionalFeeForm {
    licenceCategoryKey: string;
    additionalFee: string;
}
export default function addLicenceCategoryAdditionalFee(licenceCategoryAdditionalFeeForm: AddLicenceCategoryAdditionalFeeForm, requestSession: PartialSession): string;

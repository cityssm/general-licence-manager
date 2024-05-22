import type * as recordTypes from '../../types/recordTypes';
export declare function getLicenceCategory(licenceCategoryKey: string, options: {
    includeApprovals: boolean;
    includeFees: 'current' | 'all' | false;
    includeFields: boolean;
    includeAdditionalFees: boolean;
}): recordTypes.LicenceCategory;
export default getLicenceCategory;

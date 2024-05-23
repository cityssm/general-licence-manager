import type * as recordTypes from '../types/recordTypes.js';
export default function getLicenceCategory(licenceCategoryKey: string, options: {
    includeApprovals: boolean;
    includeFees: 'current' | 'all' | false;
    includeFields: boolean;
    includeAdditionalFees: boolean;
}): recordTypes.LicenceCategory;

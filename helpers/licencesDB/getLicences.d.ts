import type { Licence } from '../../types/recordTypes.js';
interface GetLicencesFilters {
    licenceCategoryKey?: string;
    licenceDetails?: string;
    licensee?: string;
    licenceStatus?: '' | 'active' | 'past';
    startDateMin?: number;
    startDateMax?: number;
    relatedLicenceId?: number | string;
    notRelatedLicenceId?: number | string;
    searchString?: string;
}
export default function getLicences(filters: GetLicencesFilters, options: {
    limit: number;
    offset: number;
    includeFields?: boolean;
    includeTransactions?: boolean;
}): {
    count: number;
    licences: Licence[];
};
export {};

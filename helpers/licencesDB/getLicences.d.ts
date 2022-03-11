import type * as recordTypes from "../../types/recordTypes";
interface GetLicencesFilters {
    licenceCategoryKey?: string;
    licensee?: string;
    licenceStatus?: "" | "active" | "past";
    startDateMin?: number;
    startDateMax?: number;
    relatedLicenceId?: number | string;
}
export declare const getLicences: (filters: GetLicencesFilters, options: {
    limit: number;
    offset: number;
    includeFields?: boolean;
    includeTransactions?: boolean;
}) => {
    count: number;
    licences: recordTypes.Licence[];
};
export default getLicences;

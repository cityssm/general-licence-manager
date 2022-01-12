import type * as recordTypes from "../../types/recordTypes";
interface GetLicencesFilters {
    licenceCategoryKey?: string;
}
export declare const getLicences: (filters: GetLicencesFilters, options: {
    limit: number;
    offset: number;
}) => {
    count: number;
    licences: recordTypes.Licence[];
};
export default getLicences;

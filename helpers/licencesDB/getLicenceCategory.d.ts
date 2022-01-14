import type * as recordTypes from "../../types/recordTypes";
export declare const getLicenceCategory: (licenceCategoryKey: string, options: {
    includeApprovals: boolean;
    includeFees: "current" | "all" | false;
    includeFields: boolean;
}) => recordTypes.LicenceCategory;
export default getLicenceCategory;

import type * as recordTypes from "../types/recordTypes";
export declare const getLicenceCategories: () => recordTypes.LicenceCategory[];
export declare const getLicenceCategory: (licenceCategoryKey: string) => recordTypes.LicenceCategory;
export declare const getLicenceCategoryAdditionalFee: (licenceAdditionalFeeKey: string) => recordTypes.LicenceCategoryAdditionalFee;
export declare const clearAll: () => void;

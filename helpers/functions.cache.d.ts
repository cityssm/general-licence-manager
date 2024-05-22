import type { LicenceCategory, LicenceCategoryAdditionalFee } from '../types/recordTypes.js';
export declare function getLicenceCategories(): LicenceCategory[];
export declare function getLicenceCategory(licenceCategoryKey: string): LicenceCategory | undefined;
export declare function getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey: string): LicenceCategoryAdditionalFee | undefined;
export declare function clearAll(): void;

import sqlite from 'better-sqlite3';
import type { LicenceCategoryAdditionalFee } from '../../types/recordTypes.js';
export declare function getLicenceCategoryAdditionalFee(licenceAdditionalFeeKey: string, database?: sqlite.Database): LicenceCategoryAdditionalFee | undefined;
export default getLicenceCategoryAdditionalFee;

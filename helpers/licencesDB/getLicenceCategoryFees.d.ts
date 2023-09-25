import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceCategoryFees: (licenceCategoryKey: string, feeType: 'current' | 'all', database?: sqlite.Database) => recordTypes.LicenceCategoryFee[];
export default getLicenceCategoryFees;

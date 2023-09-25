import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceCategoryFee: (licenceFeeId: number | string, database?: sqlite.Database) => recordTypes.LicenceCategoryFee;
export default getLicenceCategoryFee;

import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceCategoryFields: (licenceCategoryKey: string, database?: sqlite.Database) => recordTypes.LicenceCategoryField[];
export default getLicenceCategoryFields;

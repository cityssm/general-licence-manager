import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceTransactions: (licenceId: number | string, database?: sqlite.Database) => recordTypes.LicenceTransaction[];
export default getLicenceTransactions;

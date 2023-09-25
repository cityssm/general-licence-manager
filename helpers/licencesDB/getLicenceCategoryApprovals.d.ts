import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceCategoryApprovals: (licenceCategoryKey: string, database?: sqlite.Database) => recordTypes.LicenceCategoryApproval[];
export default getLicenceCategoryApprovals;

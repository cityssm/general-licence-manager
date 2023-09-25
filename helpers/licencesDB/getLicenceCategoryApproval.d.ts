import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare const getLicenceCategoryApproval: (licenceApprovalKey: string, database?: sqlite.Database) => recordTypes.LicenceCategoryApproval;
export default getLicenceCategoryApproval;

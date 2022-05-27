import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLicenceCategoryAdditionalFees: (licenceCategoryKey: string, database?: sqlite.Database) => recordTypes.LicenceCategoryAdditionalFee[];
export default getLicenceCategoryAdditionalFees;

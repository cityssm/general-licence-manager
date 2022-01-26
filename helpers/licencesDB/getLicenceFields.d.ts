import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLicenceFields: (licenceId: number | string, licenceCategoryKey: string, database?: sqlite.Database) => recordTypes.LicenceField[];
export default getLicenceFields;

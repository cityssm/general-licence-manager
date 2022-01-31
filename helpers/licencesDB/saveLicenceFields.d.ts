import sqlite from "better-sqlite3";
export declare const saveLicenceFields: (licenceId: number | string, licenceFieldKeys: string[], licenceForm: {
    [fieldKey: string]: string;
}, database?: sqlite.Database) => boolean;
export default saveLicenceFields;

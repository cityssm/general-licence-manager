import sqlite from 'better-sqlite3';
export declare function addRelatedLicence(licenceIdA: number | string, licenceIdB: number | string, database?: sqlite.Database): boolean;
export default addRelatedLicence;

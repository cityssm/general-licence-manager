import sqlite from 'better-sqlite3';
export declare const getNextLicenceTransactionIndex: (licenceId: number | string, database: sqlite.Database) => number;
export default getNextLicenceTransactionIndex;

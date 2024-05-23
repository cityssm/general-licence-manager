import type sqlite from 'better-sqlite3';
export default function getNextLicenceTransactionIndex(licenceId: number | string, database: sqlite.Database): number;

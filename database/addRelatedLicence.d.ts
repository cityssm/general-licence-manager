import sqlite from 'better-sqlite3';
export default function addRelatedLicence(licenceIdA: number | string, licenceIdB: number | string, database?: sqlite.Database): boolean;

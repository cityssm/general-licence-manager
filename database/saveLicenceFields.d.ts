import sqlite from 'better-sqlite3';
export default function saveLicenceFields(licenceId: number | string, licenceFieldKeys: string[], licenceForm: Record<string, string>, database?: sqlite.Database): boolean;

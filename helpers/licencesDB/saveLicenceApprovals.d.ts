import sqlite from 'better-sqlite3';
export default function saveLicenceApprovals(licenceId: number | string, licenceApprovalKeys: string[], licenceForm: Record<string, string>, database?: sqlite.Database): boolean;

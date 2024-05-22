import sqlite from 'better-sqlite3';
import type { LicenceCategoryApproval } from '../../types/recordTypes.js';
export default function getLicenceCategoryApprovals(licenceCategoryKey: string, database?: sqlite.Database): LicenceCategoryApproval[];

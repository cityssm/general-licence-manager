import sqlite from 'better-sqlite3';
import type { LicenceCategoryApproval } from '../types/recordTypes.js';
export default function getLicenceCategoryApproval(licenceApprovalKey: string, database?: sqlite.Database): LicenceCategoryApproval;

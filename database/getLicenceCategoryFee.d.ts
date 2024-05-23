import sqlite from 'better-sqlite3';
import type { LicenceCategoryFee } from '../types/recordTypes.js';
export default function getLicenceCategoryFee(licenceFeeId: number | string, database?: sqlite.Database): LicenceCategoryFee | undefined;

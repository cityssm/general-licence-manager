import sqlite from 'better-sqlite3';
import type { LicenceField } from '../../types/recordTypes.js';
export default function getLicenceFields(licenceId: number | string, licenceCategoryKey: string, database?: sqlite.Database): LicenceField[];

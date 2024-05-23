import sqlite from 'better-sqlite3';
import type { LicenceCategoryField } from '../types/recordTypes.js';
export default function getLicenceCategoryField(licenceFieldKey: string, database?: sqlite.Database): LicenceCategoryField | undefined;

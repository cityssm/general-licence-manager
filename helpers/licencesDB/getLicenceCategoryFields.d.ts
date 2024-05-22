import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export default function getLicenceCategoryFields(licenceCategoryKey: string, database?: sqlite.Database): recordTypes.LicenceCategoryField[];

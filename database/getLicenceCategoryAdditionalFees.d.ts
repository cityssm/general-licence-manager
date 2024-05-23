import sqlite from 'better-sqlite3';
import type * as recordTypes from '../types/recordTypes.js';
export default function getLicenceCategoryAdditionalFees(licenceCategoryKey: string, database?: sqlite.Database): recordTypes.LicenceCategoryAdditionalFee[];

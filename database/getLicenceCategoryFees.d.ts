import sqlite from 'better-sqlite3';
import type * as recordTypes from '../types/recordTypes.js';
export default function getLicenceCategoryFees(licenceCategoryKey: string, feeType: 'current' | 'all', database?: sqlite.Database): recordTypes.LicenceCategoryFee[];

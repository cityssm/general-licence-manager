import sqlite from 'better-sqlite3';
import type * as recordTypes from '../types/recordTypes.js';
export default function getLicenceTransactions(licenceId: number | string, database?: sqlite.Database): recordTypes.LicenceTransaction[];

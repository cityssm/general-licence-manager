import sqlite from 'better-sqlite3';
export declare function getCategorySlug(licenceCategory: string, maxLength?: number): string;
export default function getNextLicenceNumber(licenceDetails: {
    licenceCategory: string;
}, database?: sqlite.Database): string;

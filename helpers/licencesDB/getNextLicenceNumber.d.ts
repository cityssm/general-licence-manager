import sqlite from 'better-sqlite3';
export declare const getCategorySlug: (licenceCategory: string, maxLength?: number) => string;
export declare const getNextLicenceNumber: (licenceDetails: {
    licenceCategory: string;
}, database?: sqlite.Database) => string;
export default getNextLicenceNumber;
